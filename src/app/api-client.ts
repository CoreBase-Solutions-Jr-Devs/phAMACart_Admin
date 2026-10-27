import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { Mutex } from "async-mutex";

import { RootState } from "./store";
import { AUTH_ROUTES } from "@/routes/common/routePath";
import { parseError } from "@/lib/parse-error";
import { CLIENT } from "./api-paths";

const mutex = new Mutex();

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

/* =========================================================
 * TYPES
 * ========================================================= */

type RefreshResponse = {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresAtUtc?: string;
  user?: unknown;
};

/* =========================================================
 * NORMAL API REQUEST
 * ========================================================= */

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,

  prepareHeaders: (
    headers,
    { getState },
  ) => {
    const state =
      getState() as RootState;

    const accessToken =
      state.auth.accessToken;

    const tenant =
      state.tenant.currentTenant;

    if (accessToken) {
      headers.set(
        "Authorization",
        `Bearer ${accessToken}`,
      );
    }

    if (tenant?.id) {
      headers.set(
        "X-Tenant-Id",
        tenant.id,
      );
    }

    return headers;
  },
});

/* =========================================================
 * REFRESH API REQUEST
 *
 * Does NOT send Authorization.
 * DOES send X-Tenant-Id.
 * ========================================================= */

const refreshBaseQuery =
  fetchBaseQuery({
    baseUrl: API_BASE_URL,

    prepareHeaders: (
      headers,
      { getState },
    ) => {
      const state =
        getState() as RootState;

      const tenant =
        state.tenant.currentTenant;

      if (tenant?.id) {
        headers.set(
          "X-Tenant-Id",
          tenant.id,
        );
      }

      return headers;
    },
  });

/* =========================================================
 * AUTH HELPERS
 * ========================================================= */

const redirectToSignIn = () => {
  if (
    window.location.pathname !==
    AUTH_ROUTES.SIGN_IN
  ) {
    window.location.href =
      AUTH_ROUTES.SIGN_IN;
  }
};

const performLogout = (api: {
  dispatch: (
    action: unknown,
  ) => unknown;
}) => {
  api.dispatch({
    type: "auth/logout",
  });

  redirectToSignIn();
};

/* =========================================================
 * ERROR NORMALIZATION
 * ========================================================= */

/**
 * Normalize the human-readable error message
 * while preserving RTK Query's FetchBaseQueryError
 * discriminated union.
 *
 * Important:
 *
 * FETCH_ERROR
 *   {
 *     status: "FETCH_ERROR",
 *     error: string
 *   }
 *
 * PARSING_ERROR
 *   {
 *     status: "PARSING_ERROR",
 *     originalStatus: number,
 *     error: string,
 *     data: unknown
 *   }
 *
 * TIMEOUT_ERROR
 *   {
 *     status: "TIMEOUT_ERROR",
 *     error: string
 *   }
 *
 * CUSTOM_ERROR
 *   {
 *     status: "CUSTOM_ERROR",
 *     error?: string,
 *     data?: unknown
 *   }
 *
 * HTTP ERROR
 *   {
 *     status: number,
 *     data: unknown
 *   }
 */
const normalizeError = (
  error: FetchBaseQueryError,
): FetchBaseQueryError => {
  const message =
    parseError(error);

  switch (error.status) {
    case "FETCH_ERROR":
      return {
        status: "FETCH_ERROR",
        error: message,
      };

    case "PARSING_ERROR":
      return {
        status: "PARSING_ERROR",
        originalStatus:
          error.originalStatus,
        error: message,
        data: error.data,
      };

    case "TIMEOUT_ERROR":
      return {
        status: "TIMEOUT_ERROR",
        error: message,
      };

    case "CUSTOM_ERROR":
      return {
        status: "CUSTOM_ERROR",
        error: message,
        ...(error.data !== undefined
          ? {
              data: error.data,
            }
          : {}),
      };

    default:
      return {
        status: error.status,
        data: error.data,
      };
  }
};

/* =========================================================
 * BASE QUERY WITH RE-AUTH
 * ========================================================= */

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (
  args,
  api,
  extraOptions,
) => {
  /* =======================================================
   * WAIT FOR EXISTING REFRESH
   * ======================================================= */

  await mutex.waitForUnlock();

  /* =======================================================
   * ORIGINAL REQUEST
   * ======================================================= */

  let result =
    await baseQuery(
      args,
      api,
      extraOptions,
    );

  /* =======================================================
   * NON-401 RESPONSE
   * ======================================================= */

  if (
    result.error?.status !== 401
  ) {
    if (result.error) {
      return {
        error: normalizeError(
          result.error,
        ),
      };
    }

    return {
      data: result.data,
    };
  }

  /* =======================================================
   * ANOTHER REQUEST IS REFRESHING
   * ======================================================= */

  if (mutex.isLocked()) {
    await mutex.waitForUnlock();

    const retryResult =
      await baseQuery(
        args,
        api,
        extraOptions,
      );

    if (retryResult.error) {
      return {
        error: normalizeError(
          retryResult.error,
        ),
      };
    }

    return {
      data: retryResult.data,
    };
  }

  /* =======================================================
   * ACQUIRE REFRESH LOCK
   * ======================================================= */

  const release =
    await mutex.acquire();

  try {
    /* =====================================================
     * READ CURRENT STATE AFTER LOCK
     * ===================================================== */

    const state =
      api.getState() as RootState;

    const accessToken =
      state.auth.accessToken;

    const refreshToken =
      state.auth.refreshToken;

    const tenant =
      state.tenant.currentTenant;

    console.log(
      "🔐 Authentication state before refresh",
      {
        accessTokenPresent:
          !!accessToken,

        refreshTokenPresent:
          !!refreshToken,

        tenantId:
          tenant?.id ?? null,
      },
    );

    /* =====================================================
     * NO REFRESH TOKEN
     * ===================================================== */

    if (!refreshToken) {
      console.warn(
        "❌ No refresh token available",
      );

      performLogout(api);

      if (result.error) {
        return {
          error: normalizeError(
            result.error,
          ),
        };
      }

      return {
        data: result.data,
      };
    }

    /* =====================================================
     * NO TENANT
     * ===================================================== */

    if (!tenant?.id) {
      console.warn(
        "❌ No tenant available for refresh",
      );

      performLogout(api);

      if (result.error) {
        return {
          error: normalizeError(
            result.error,
          ),
        };
      }

      return {
        data: result.data,
      };
    }

    /* =====================================================
     * REFRESH TOKEN REQUEST
     * ===================================================== */

    console.log(
      "🔄 Refreshing access token...",
    );

    const refreshResult =
      await refreshBaseQuery(
        {
          url: `${CLIENT}/identity/refresh-token`,
          method: "POST",
          body: {
            refreshToken,
          },
        },
        api,
        extraOptions,
      );

    /* =====================================================
     * REFRESH FAILED
     * ===================================================== */

    if (refreshResult.error) {
      console.error(
        "❌ Refresh token request failed",
        {
          status:
            refreshResult.error.status,

          error:
            refreshResult.error,

          tenantId:
            tenant.id,

          refreshTokenPresent:
            !!refreshToken,
        },
      );

      performLogout(api);

      return {
        error: normalizeError(
          refreshResult.error,
        ),
      };
    }

    /* =====================================================
     * READ REFRESH RESPONSE
     * ===================================================== */

    const data =
      refreshResult.data as RefreshResponse;

    console.log(
      "✅ Refresh response received",
      {
        accessTokenPresent:
          !!data?.accessToken,

        refreshTokenPresent:
          !!data?.refreshToken,

        accessTokenExpiresAtUtc:
          data?.accessTokenExpiresAtUtc,
      },
    );

    /* =====================================================
     * VALIDATE REFRESH RESPONSE
     * ===================================================== */

    if (
      !data?.accessToken ||
      !data?.refreshToken
    ) {
      console.error(
        "❌ Refresh response missing tokens",
        data,
      );

      performLogout(api);

      return {
        error: {
          status: "CUSTOM_ERROR",
          error:
            "Invalid refresh response.",
          data:
            "Refresh token response did not contain valid credentials.",
        },
      };
    }

    /* =====================================================
     * STORE NEW CREDENTIALS
     * ===================================================== */

    api.dispatch({
      type: "auth/setCredentials",
      payload: {
        accessToken:
          data.accessToken,

        refreshToken:
          data.refreshToken,
      },
    });

    console.log(
      "✅ New credentials stored",
    );

    /* =====================================================
     * RETRY ORIGINAL REQUEST
     * ===================================================== */

    result =
      await baseQuery(
        args,
        api,
        extraOptions,
      );

    /* =====================================================
     * RETRY STILL 401
     * ===================================================== */

    if (
      result.error?.status === 401
    ) {
      console.error(
        "❌ New access token was rejected",
      );

      performLogout(api);

      return {
        error: normalizeError(
          result.error,
        ),
      };
    }

    /* =====================================================
     * RETRY FAILED
     * ===================================================== */

    if (result.error) {
      return {
        error: normalizeError(
          result.error,
        ),
      };
    }

    /* =====================================================
     * RETRY SUCCESS
     * ===================================================== */

    return {
      data: result.data,
    };
  } finally {
    /* =====================================================
     * ALWAYS RELEASE MUTEX
     * ===================================================== */

    release();
  }
};

/* =========================================================
 * API CLIENT
 * ========================================================= */

export const apiClient =
  createApi({
    reducerPath: "api",

    baseQuery:
      baseQueryWithReauth,

    refetchOnMountOrArgChange:
      true,

    tagTypes: [
      "categories",
      "products",
      "analytics",
      "apikey",
      "brands",
      "banners",
      "company_profile",
      "stores",
      "deliverySettings",
      "orders",
      "prescriptions",
      "notifications",
      "tenants",
      "users",
      "roles",
      "permissions",
      "audit",
      "reports",
      "health",
      "searchInsights",
      "myPermissions",
      "sessions",
      "featureFlags",
    ],

    endpoints: () => ({}),
  });