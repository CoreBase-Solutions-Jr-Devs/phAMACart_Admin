import { apiClient } from "@/app/api-client";
import { ADMIN } from "@/app/api-paths";
import {
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  PaginatedResult,
  RoleDto,
  User,
  UserSearchRequest,
  RoleSearchRequest,
  SessionSearchRequest,
  StaffChangeResult,
  StaffMember,
  UserSession,
} from "./usersType";

export const usersAPI = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<
      CreateUserResponse,
      CreateUserRequest
    >({
      query: (body) => ({
        url: `${ADMIN}/identity/users`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["users"],
    }),

    searchUsers: builder.query<
      { users: PaginatedResult<User> },
      UserSearchRequest
    >({
      query: ({
        searchTerm,
        roleName,
        isActive,
        pageIndex = 0,
        pageSize = 20,
      }) => ({
        url: `${ADMIN}/identity/users`,
        method: "GET",
        params: {
          Page: pageIndex,
          PageSize: pageSize,
          SearchTerm: searchTerm,
          RoleName: roleName,
          IsActive: isActive,
        },
      }),
      providesTags: ["users"],
    }),

    getUserById: builder.query<{ user: User }, string>({
      query: (id) => ({
        url: `${ADMIN}/identity/users/${id}`,
        method: "GET",
      }),
      providesTags: (_r, _e, id) => [{ type: "users", id }],
    }),

    updateUser: builder.mutation<
      void,
      { id: string; body: UpdateUserRequest }
    >({
      query: ({ id, body }) => ({
        url: `${ADMIN}/identity/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["users"],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `${ADMIN}/identity/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),

    /** Deactivate (reactivate=false) or reactivate an account. Reversible. */
    setUserStatus: builder.mutation<void, { id: string; reactivate: boolean }>({
      query: ({ id, reactivate }) => ({
        url: `${ADMIN}/identity/users/${id}/status`,
        method: "PUT",
        body: { reactivate },
      }),
      invalidatesTags: ["users"],
    }),

    /** Clears a lockout caused by too many failed sign-ins. */
    unlockUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `${ADMIN}/identity/users/${id}/unlock`,
        method: "POST",
      }),
      invalidatesTags: ["users"],
    }),

    getRoles: builder.query<
      PaginatedResult<RoleDto>,
      RoleSearchRequest
    >({
      query: ({
        searchTerm,
        isSystemRole,
        isActive,
        pageIndex = 0,
        pageSize = 20,
      }) => ({
        url: `${ADMIN}/identity/roles`,
        method: "GET",
        params: {
          PageIndex: pageIndex,
          PageSize: pageSize,
          SearchTerm: searchTerm,
          IsSystemRole: isSystemRole,
          IsActive: isActive,
        },
      }),
    }),

    /* ---------- Staff (promote / demote) ---------- */

    getStaff: builder.query<StaffMember[], void>({
      query: () => `${ADMIN}/identity/staff`,
      providesTags: ["users"],
    }),

    promoteUser: builder.mutation<StaffChangeResult, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `${ADMIN}/identity/users/${id}/promote`,
        method: "POST",
        body: { role },
      }),
      invalidatesTags: ["users", "sessions"],
    }),

    demoteUser: builder.mutation<StaffChangeResult, string>({
      query: (id) => ({
        url: `${ADMIN}/identity/users/${id}/demote`,
        method: "POST",
      }),
      invalidatesTags: ["users", "sessions"],
    }),

    /* ---------- Sessions ---------- */

    searchSessions: builder.query<PaginatedResult<UserSession>, SessionSearchRequest>({
      query: ({ searchTerm, activeOnly = true, pageIndex = 0, pageSize = 20 }) => ({
        url: `${ADMIN}/identity/sessions`,
        params: {
          SearchTerm: searchTerm || undefined,
          ActiveOnly: activeOnly,
          PageIndex: pageIndex,
          PageSize: pageSize,
        },
      }),
      providesTags: ["sessions"],
    }),

    getUserSessions: builder.query<UserSession[], { userId: string; activeOnly?: boolean }>({
      query: ({ userId, activeOnly }) => ({
        url: `${ADMIN}/identity/users/${userId}/sessions`,
        params: { activeOnly: activeOnly || undefined },
      }),
      providesTags: ["sessions"],
    }),

    revokeSession: builder.mutation<{ revoked: number }, string>({
      query: (sessionId) => ({
        url: `${ADMIN}/identity/sessions/${sessionId}/revoke`,
        method: "POST",
      }),
      invalidatesTags: ["sessions"],
    }),

    revokeAllUserSessions: builder.mutation<{ revoked: number }, string>({
      query: (userId) => ({
        url: `${ADMIN}/identity/users/${userId}/sessions/revoke-all`,
        method: "POST",
      }),
      invalidatesTags: ["sessions"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useSearchUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useSetUserStatusMutation,
  useUnlockUserMutation,
  useGetRolesQuery,
  useGetStaffQuery,
  usePromoteUserMutation,
  useDemoteUserMutation,
  useSearchSessionsQuery,
  useGetUserSessionsQuery,
  useRevokeSessionMutation,
  useRevokeAllUserSessionsMutation,
} = usersAPI;
