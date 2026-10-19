import { apiClient } from "@/app/api-client";
import {
  CreateUserRequest,
  CreateUserResponse,
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
        url: "/identity/users",
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
        url: "/identity/users",
        method: "GET",
        params: {
          Page: pageIndex,
          PageSize: pageSize,
          SearchTerm: searchTerm,
          RoleName: roleName,
          IsActive: isActive,
        },
      }),
    }),

    getUserById: builder.query<{ user: User }, string>({
      query: (id) => ({
        url: `/identity/users/${id}`,
        method: "GET",
      }),
    }),

    updateUser: builder.mutation<
      void,
      { id: string; body: CreateUserRequest }
    >({
      query: ({ id, body }) => ({
        url: `/identity/users/${id}`,
        method: "PUT",
        body,
      }),
    }),

    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/identity/users/${id}`,
        method: "DELETE",
      }),
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
        url: "/identity/roles",
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
  useGetRolesQuery,
} = usersAPI;
