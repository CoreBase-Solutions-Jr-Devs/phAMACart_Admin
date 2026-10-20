import type { PaginatedResult } from "@/features/users/usersType";

export type { PaginatedResult };

/** Mirrors Identity.Contracts.Enums.PermissionModule (responses send the number). */
export const PERMISSION_MODULES: Record<number, string> = {
  1: "Users",
  2: "Roles",
  3: "Permissions",
  4: "Catalog",
  5: "Basket",
  6: "Configuration",
  7: "Multi-tenancy",
  8: "Notifications",
  9: "Prescriptions",
  10: "Orders",
  11: "Payments",
  12: "Integrations",
  13: "Audit",
};

export interface RoleSummary {
  id: string;
  name: string;
  description?: string | null;
  isSystemRole: boolean;
  userCount: number;
  permissionCount: number;
}

export interface RoleDetail extends RoleSummary {
  permissionIds: string[];
}

export interface UpsertRoleRequest {
  name: string;
  description?: string | null;
  permissionIds: string[];
}

export interface Permission {
  id: string;
  module: number;
  code: string;
  name: string;
  description?: string | null;
  isSystemPermission: boolean;
}

export interface ModulePermissions {
  module: number;
  permissions: Permission[];
}

export interface UpsertPermissionRequest {
  module: number;
  code: string;
  name: string;
  description?: string | null;
}
