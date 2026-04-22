import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import { setCredentials, logout } from "@/features/auth/authSlice";
import { Mutex } from "async-mutex";
import { AUTH_ROUTES } from "@/routes/common/routePath";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const auth = (getState() as RootState).auth;
    if (auth?.accessToken) {
      headers.set("Authorization", `Bearer ${auth.accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshToken = (api.getState() as RootState).auth.refreshToken;

        const refreshResult = await baseQuery(
          {
            url: "/identity/refresh-token",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          api.dispatch(
            setCredentials(
              refreshResult.data as {
                accessToken: string;
                refreshToken: string;
              },
            ),
          );
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
          if (window.location.pathname !== AUTH_ROUTES.SIGN_IN) {
            window.location.href = AUTH_ROUTES.SIGN_IN;
          }
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const apiClient = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  refetchOnMountOrArgChange: true,
  tagTypes: [
    "categories",
    "products",
    "analytics",
    "apikey",
    "brands",
    "banners",
    "company_profile",
    "stores",
  ],
  endpoints: () => ({}),
});
