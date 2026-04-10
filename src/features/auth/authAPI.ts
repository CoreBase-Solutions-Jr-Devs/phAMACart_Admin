import { apiClient } from "@/app/api-client";
import {
  LoginRequestBody,
  LoginResponseType,
  CurrentUserResponseType,
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

    getCurrentUser: builder.query<CurrentUserResponseType, void>({
      query: () => ({
        url: "/identity/current-user",
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginMutation, useGetCurrentUserQuery } = authApi;
