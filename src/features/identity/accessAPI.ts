import { apiClient } from "@/app/api-client";
import { ADMIN } from "@/app/api-paths";
import type {
  ModulePermissions,
  PaginatedResult,
  RoleDetail,
  RoleSummary,
  UpsertPermissionRequest,
  UpsertRoleRequest,
} from "./accessType";

/** Roles & permissions (Identity, SuperAdminOnly). */
export const accessApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getRoleList: builder.query<
      PaginatedResult<RoleSummary>,
      { searchTerm?: string; pageIndex?: number; pageSize?: number } | void
    >({
      query: (params) => ({
        url: `${ADMIN}/identity/roles`,
        params: {
          SearchTerm: params?.searchTerm || undefined,
          PageIndex: params?.pageIndex ?? 0,
          PageSize: params?.pageSize ?? 50,
        },
      }),
      providesTags: ["roles"],
    }),

    getRoleById: builder.query<RoleDetail, string>({
      query: (roleId) => `${ADMIN}/identity/roles/${roleId}`,
      providesTags: (_r, _e, id) => [{ type: "roles", id }],
    }),

    createRole: builder.mutation<string, UpsertRoleRequest>({
      query: (body) => ({
        url: `${ADMIN}/identity/roles`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["roles"],
    }),

    updateRole: builder.mutation<string, { roleId: string; body: UpsertRoleRequest }>({
      query: ({ roleId, body }) => ({
        url: `${ADMIN}/identity/roles/${roleId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["roles"],
    }),

    assignRolePermissions: builder.mutation<string, { roleId: string; permissionIds: string[] }>({
      query: ({ roleId, permissionIds }) => ({
        url: `${ADMIN}/identity/roles/${roleId}/permissions`,
        method: "PUT",
        body: { permissionIds },
      }),
      invalidatesTags: ["roles"],
    }),

    /** Permissions grouped by module. The page size counts modules, not permissions. */
    getPermissions: builder.query<
      PaginatedResult<ModulePermissions>,
      { searchTerm?: string; module?: number } | void
    >({
      query: (params) => ({
        url: `${ADMIN}/identity/permissions`,
        params: {
          searchTerm: params?.searchTerm || undefined,
          module: params?.module,
          pageIndex: 0,
          pageSize: 100,
        },
      }),
      providesTags: ["permissions"],
    }),

    createPermission: builder.mutation<string, UpsertPermissionRequest>({
      query: (body) => ({
        url: `${ADMIN}/identity/permissions`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["permissions", "roles"],
    }),

    updatePermission: builder.mutation<
      string,
      { permissionId: string; body: UpsertPermissionRequest }
    >({
      query: ({ permissionId, body }) => ({
        url: `${ADMIN}/identity/permissions/${permissionId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["permissions", "roles"],
    }),
  }),
});

export const {
  useGetRoleListQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useAssignRolePermissionsMutation,
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
} = accessApi;
