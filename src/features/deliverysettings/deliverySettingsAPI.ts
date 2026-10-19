import { apiClient } from "@/app/api-client";

import {
  DeliverySettings,
  GooglePlaceAddressInput,
  LocationSuggestionDto,
  ResolvedLocationDto,
  UpdateDeliverySettingsRequest,
  UpdateDeliverySettingsResponse,
} from "./deliverySettingsType";

export const deliverySettingsAPI =
  apiClient.injectEndpoints({
    endpoints: (builder) => ({
      /* =====================================================
       * DELIVERY SETTINGS
       * ===================================================== */

      getDeliverySettings: builder.query<
        { deliverySettings: DeliverySettings },
        void
      >({
        query: () => ({
          url: "/delivery-settings",
          method: "GET",
        }),

        providesTags: ["deliverySettings"],
      }),

      updateDeliverySettings:
        builder.mutation<
          UpdateDeliverySettingsResponse,
          UpdateDeliverySettingsRequest
        >({
          query: (body) => ({
            url: "/delivery-settings",
            method: "PATCH",
            body,
          }),

          invalidatesTags: [
            "deliverySettings",
          ],
        }),

      /* =====================================================
       * LOCATION SUGGESTIONS
       * ===================================================== */

      getLocationSuggestions:
        builder.query<
          LocationSuggestionDto[],
          {
            input: string;
            sessionToken: string;
          }
        >({
          query: ({
            input,
            sessionToken,
          }) => ({
            url: "/locations/suggestions",
            method: "GET",
            params: {
              input,
              sessionToken,
            },
          }),

          /**
           * Suggestions are short-lived.
           *
           * The component should also use
           * skip / skipToken when input is empty.
           */
          keepUnusedDataFor: 0,
        }),

      /* =====================================================
       * LOCATION DETAILS
       * ===================================================== */

      getLocationDetails:
        builder.query<
          GooglePlaceAddressInput,
          {
            placeId: string;
            sessionToken: string;
          }
        >({
          query: ({
            placeId,
            sessionToken,
          }) => ({
            url: "/locations/details",
            method: "GET",
            params: {
              placeId,
              sessionToken,
            },
          }),

          transformResponse: (
            location: ResolvedLocationDto,
          ): GooglePlaceAddressInput => ({
            /**
             * Backend currently returns
             * formattedAddress rather than a
             * separately parsed street value.
             */
            street: "",

            city: location.city,

            county: location.county,

            postalCode:
              location.postalCode,

            country: location.country,

            latitude:
              String(location.latitude),

            longitude:
              String(location.longitude),

            googlePlaceId:
              location.placeId,
          }),
        }),

      /* =====================================================
       * CURRENT LOCATION
       * ===================================================== */

      getCurrentLocationAddress:
        builder.query<
          GooglePlaceAddressInput,
          {
            latitude: number;
            longitude: number;
          }
        >({
          query: ({
            latitude,
            longitude,
          }) => ({
            url: "/locations/current",
            method: "GET",
            params: {
              latitude,
              longitude,
            },
          }),

          transformResponse: (
            location: ResolvedLocationDto,
          ): GooglePlaceAddressInput => ({
            street: "",

            city: location.city,

            county: location.county,

            postalCode:
              location.postalCode,

            country: location.country,

            latitude:
              String(location.latitude),

            longitude:
              String(location.longitude),

            googlePlaceId:
              location.placeId,
          }),
        }),
    }),
  });

/* =========================================================
 * HOOKS
 * ========================================================= */

export const {
  useGetDeliverySettingsQuery,
  useUpdateDeliverySettingsMutation,
  useGetLocationSuggestionsQuery,
  useLazyGetLocationSuggestionsQuery,
  useGetLocationDetailsQuery,
  useLazyGetLocationDetailsQuery,
  useGetCurrentLocationAddressQuery,
  useLazyGetCurrentLocationAddressQuery,
} = deliverySettingsAPI;
