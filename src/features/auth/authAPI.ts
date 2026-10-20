import { apiClient } from "@/app/api-client";
import { CLIENT } from "@/app/api-paths";

import {
  LoginRequestBody,
  LoginResponseType,
  CurrentUserResponseType,
} from "./authType";

export const authApi =
  apiClient.injectEndpoints({
    endpoints: (builder) => ({
      login:
        builder.mutation<
          LoginResponseType,
          LoginRequestBody
        >({
          query: (credentials) => ({
            url: `${CLIENT}/identity/sign-in`,
            method: "POST",
            body: credentials,
          }),
        }),

      /** Revokes this user's refresh-token sessions on the server. */
      signOut: builder.mutation<void, void>({
        query: () => ({
          url: `${CLIENT}/identity/sign-out`,
          method: "POST",
        }),
      }),

      /** Returns fresh tokens: the server revokes the other sessions. */
      changePassword: builder.mutation<
        {
          accessToken: string;
          refreshToken: string;
          accessTokenExpiresAtUtc: string;
        },
        { currentPassword: string; newPassword: string }
      >({
        query: (body) => ({
          url: `${CLIENT}/identity/change-password`,
          method: "POST",
          body,
        }),
      }),

      getCurrentUser:
        builder.query<
          CurrentUserResponseType,
          void
        >({
          query: () => ({
            url: `${CLIENT}/identity/current-user`,
            method: "GET",
          }),
        }),
    }),
  });

export const {
  useLoginMutation,
  useSignOutMutation,
  useChangePasswordMutation,
  useGetCurrentUserQuery,
} = authApi;