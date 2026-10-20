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
} = usersAPI;
