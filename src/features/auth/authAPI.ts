import { apiClient } from "@/app/api-client";
import {
  LoginRequestBody,
  LoginResponseType,
  CurrentUserResponseType,
  RefreshTokenResponseType,
} from "./authType";

export const authApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponseType, LoginRequestBody>({
      query: (credentials) => ({
        url: "/identity/sign-in",
        method: "POST",
        body: credentials,
      }),
    }),

    refreshToken: builder.mutation<RefreshTokenResponseType, void>({
      query: () => ({
        url: "/identity/refresh-token",
        method: "POST",
        body: { refreshToken: localStorage.getItem("refreshToken") },
      }),
    }),

    getCurrentUser: builder.query<CurrentUserResponseType, void>({
      query: () => ({
        url: "/identity/current-user",
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginMutation, useGetCurrentUserQuery } = authApi;
