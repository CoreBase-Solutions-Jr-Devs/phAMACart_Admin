import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLazyGetCurrentLocationAddressQuery,
  useLazyGetLocationDetailsQuery,
  useLazyGetLocationSuggestionsQuery,
} from "@/features/deliverysettings/deliverySettingsAPI";

import type {
  GooglePlaceAddressInput,
  LocationSuggestionDto,
} from "@/features/deliverysettings/deliverySettingsType";

const SEARCH_DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 3;

interface UseLocationResolverOptions {
  onResolve: (
    address: GooglePlaceAddressInput,
  ) => void;
}

/**
 * Creates a unique Google Places autocomplete
 * session token.
 */
function createSessionToken(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

/**
 * Extracts a safe human-readable error message
 * from an RTK Query lazy-query result.
 *
 * RTK Query errors can be:
 *
 * - FetchBaseQueryError
 * - SerializedError
 */
function getQueryErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (!error) {
    return fallback;
  }

  if (
    typeof error === "object" &&
    error !== null
  ) {
    const value = error as {
      error?: unknown;
      data?: unknown;
      message?: unknown;
    };

    if (
      typeof value.error === "string" &&
      value.error.trim()
    ) {
      return value.error;
    }

    if (
      typeof value.message === "string" &&
      value.message.trim()
    ) {
      return value.message;
    }

    if (
      typeof value.data === "string" &&
      value.data.trim()
    ) {
      return value.data;
    }

    if (
      typeof value.data === "object" &&
      value.data !== null
    ) {
      const data = value.data as {
        message?: unknown;
        error?: unknown;
        title?: unknown;
      };

      if (
        typeof data.message === "string" &&
        data.message.trim()
      ) {
        return data.message;
      }

      if (
        typeof data.error === "string" &&
        data.error.trim()
      ) {
        return data.error;
      }

      if (
        typeof data.title === "string" &&
        data.title.trim()
      ) {
        return data.title;
      }
    }
  }

  return fallback;
}

export function useLocationResolver({
  onResolve,
}: UseLocationResolverOptions) {
  /* =========================================================
   * STATE
   * ========================================================= */

  const [query, setQuery] = useState("");

  const [predictions, setPredictions] =
    useState<LocationSuggestionDto[]>([]);

  const [isSearching, setIsSearching] =
    useState(false);

  const [isResolving, setIsResolving] =
    useState(false);

  const [isLocating, setIsLocating] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* =========================================================
   * SESSION TOKEN
   * ========================================================= */

  const sessionToken = useRef(
    createSessionToken(),
  );

  /* =========================================================
   * DEBOUNCE TIMER
   * ========================================================= */

  const debounceTimer = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  /* =========================================================
   * SEARCH REQUEST
   *
   * NOTE:
   * We do not pass an AbortSignal to the RTK Query
   * lazy trigger because this version of RTK Query
   * exposes the second argument as `preferCacheValue`.
   *
   * Instead, we use a request generation ID to ignore
   * stale responses.
   * ========================================================= */

  const searchRequestId = useRef(0);

  /* =========================================================
   * RTK QUERY LAZY ENDPOINTS
   * ========================================================= */

  const [
    getLocationSuggestions,
  ] = useLazyGetLocationSuggestionsQuery();

  const [
    getLocationDetails,
  ] = useLazyGetLocationDetailsQuery();

  const [
    getCurrentLocationAddress,
  ] = useLazyGetCurrentLocationAddressQuery();

  /* =========================================================
   * RESET SESSION
   * ========================================================= */

  const resetSession = useCallback(() => {
    sessionToken.current =
      createSessionToken();
  }, []);

  /* =========================================================
   * SEARCH LOCATIONS
   * ========================================================= */

  const search = useCallback(
    (nextQuery: string) => {
      setQuery(nextQuery);
      setError(null);

      /*
       * Invalidate any previous request.
       */
      searchRequestId.current += 1;

      const requestId =
        searchRequestId.current;

      /*
       * Clear previous debounce.
       */
      if (debounceTimer.current) {
        clearTimeout(
          debounceTimer.current,
        );

        debounceTimer.current = null;
      }

      /*
       * Clear previous results for short input.
       */
      if (
        nextQuery.trim().length <
        MIN_QUERY_LENGTH
      ) {
        setPredictions([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      /*
       * Debounce autocomplete request.
       */
      debounceTimer.current =
        setTimeout(async () => {
          try {
            const result =
              await getLocationSuggestions({
                input: nextQuery.trim(),
                sessionToken:
                  sessionToken.current,
              });

            /*
             * Ignore stale responses.
             */
            if (
              requestId !==
              searchRequestId.current
            ) {
              return;
            }

            /*
             * RTK Query error.
             */
            if ("error" in result) {
              setError(
                getQueryErrorMessage(
                  result.error,
                  "Unable to search for locations.",
                ),
              );

              setPredictions([]);

              return;
            }

            /*
             * Successful response.
             */
            setPredictions(
              result.data ?? [],
            );
          } catch (searchError) {
            /*
             * Ignore stale request errors.
             */
            if (
              requestId !==
              searchRequestId.current
            ) {
              return;
            }

            console.error(
              "Location search failed:",
              searchError,
            );

            setError(
              "Unable to search for locations.",
            );

            setPredictions([]);
          } finally {
            if (
              requestId ===
              searchRequestId.current
            ) {
              setIsSearching(false);
            }
          }
        }, SEARCH_DEBOUNCE_MS);
    },
    [getLocationSuggestions],
  );

  /* =========================================================
   * RESOLVE PLACE BY ID
   * ========================================================= */

  const resolveByPlaceId =
    useCallback(
      async (placeId: string) => {
        if (!placeId) {
          setError(
            "Invalid location selected.",
          );

          return null;
        }

        setError(null);
        setIsResolving(true);

        try {
          const result =
            await getLocationDetails({
              placeId,
              sessionToken:
                sessionToken.current,
            });

          /*
           * RTK Query error.
           */
          if ("error" in result) {
            setError(
              getQueryErrorMessage(
                result.error,
                "Unable to resolve this location.",
              ),
            );

            return null;
          }

          /*
           * RTK Query can technically expose
           * undefined data, so guard it.
           */
          if (!result.data) {
            setError(
              "No location details were returned.",
            );

            return null;
          }

          const resolved =
            result.data;

          /*
           * Send resolved location to caller.
           */
          onResolve(resolved);

          /*
           * Clear autocomplete results.
           */
          setPredictions([]);

          /*
           * Place Details completes the
           * autocomplete session.
           */
          resetSession();

          return resolved;
        } catch (resolveError) {
          console.error(
            "Location resolution failed:",
            resolveError,
          );

          setError(
            "Unable to resolve this location.",
          );

          return null;
        } finally {
          setIsResolving(false);
        }
      },
      [
        getLocationDetails,
        onResolve,
        resetSession,
      ],
    );

  /* =========================================================
   * SELECT PREDICTION
   * ========================================================= */

  const selectPrediction =
    useCallback(
      (
        prediction: LocationSuggestionDto,
      ) => {
        setQuery(
          prediction.fullText,
        );

        setPredictions([]);

        return resolveByPlaceId(
          prediction.placeId,
        );
      },
      [resolveByPlaceId],
    );

  /* =========================================================
   * CURRENT LOCATION
   * ========================================================= */

  const useCurrentLocation =
    useCallback(() => {
      if (
        typeof navigator ===
          "undefined" ||
        !navigator.geolocation
      ) {
        setError(
          "Geolocation isn't available in this browser.",
        );

        return;
      }

      setError(null);
      setIsLocating(true);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const result =
              await getCurrentLocationAddress(
                {
                  latitude:
                    position.coords
                      .latitude,

                  longitude:
                    position.coords
                      .longitude,
                },
              );

            /*
             * RTK Query error.
             */
            if ("error" in result) {
              setError(
                getQueryErrorMessage(
                  result.error,
                  "Unable to determine your current location.",
                ),
              );

              return;
            }

            /*
             * Guard undefined response.
             */
            if (!result.data) {
              setError(
                "No location details were returned for your current location.",
              );

              return;
            }

            const resolved =
              result.data;

            /*
             * Send location to caller.
             */
            onResolve(resolved);

            /*
             * Clear autocomplete results.
             */
            setPredictions([]);

            /*
             * Update displayed query.
             *
             * We use the available address fields
             * without assuming a particular formatting.
             */
            const locationParts = [
              resolved.street,
              resolved.city,
              resolved.county,
              resolved.country,
            ].filter(
              (
                value,
              ): value is string =>
                Boolean(
                  value &&
                    value.trim(),
                ),
            );

            if (
              locationParts.length > 0
            ) {
              setQuery(
                locationParts.join(
                  ", ",
                ),
              );
            }

            /*
             * Current-location lookup is a
             * separate operation, so start a
             * fresh Places session.
             */
            resetSession();
          } catch (resolveError) {
            console.error(
              "Current location lookup failed:",
              resolveError,
            );

            setError(
              "Unable to determine your current location.",
            );
          } finally {
            setIsLocating(false);
          }
        },
        (geolocationError) => {
          switch (
            geolocationError.code
          ) {
            case geolocationError.PERMISSION_DENIED:
              setError(
                "Location permission was denied. Please allow location access and try again.",
              );
              break;

            case geolocationError.POSITION_UNAVAILABLE:
              setError(
                "Your current location is unavailable. Please try again.",
              );
              break;

            case geolocationError.TIMEOUT:
              setError(
                "Location request timed out. Please try again.",
              );
              break;

            default:
              setError(
                "Unable to determine your current location.",
              );
          }

          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10_000,
          maximumAge: 60_000,
        },
      );
    }, [
      getCurrentLocationAddress,
      onResolve,
      resetSession,
    ]);

  /* =========================================================
   * CLEAR ERROR
   * ========================================================= */

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* =========================================================
   * CLEANUP
   * ========================================================= */

  useEffect(() => {
    return () => {
      /*
       * Invalidate pending searches.
       */
      searchRequestId.current += 1;

      /*
       * Clear debounce.
       */
      if (debounceTimer.current) {
        clearTimeout(
          debounceTimer.current,
        );

        debounceTimer.current = null;
      }
    };
  }, []);

  /* =========================================================
   * RETURN
   * ========================================================= */

  return {
    /*
     * Search state
     */
    query,
    predictions,
    error,

    /*
     * Loading state
     */
    isSearching,
    isResolving,
    isLocating,

    /*
     * Actions
     */
    search,
    selectPrediction,
    resolveByPlaceId,
    useCurrentLocation,

    /*
     * Utilities
     */
    resetSession,
    clearError,
  };
}