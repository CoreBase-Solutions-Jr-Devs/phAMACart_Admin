/**
 * Permission codes checked by the API (`.RequirePermission(...)`).
 * Mirrors Backend/src/BuildingBlocks/Shared/Security/PermissionCatalog.cs —
 * keep the two in sync when adding a permission.
 */
export const PERMISSIONS = {
  CATALOG_VIEW: "Catalog.View",
  PRODUCTS_MANAGE: "Catalog.Products.Manage",
  PRODUCTS_DELETE: "Catalog.Products.Delete",
  PRODUCTS_IMPORT: "Catalog.Products.Import",
  PRODUCTS_SYNC: "Catalog.Products.Sync",
  BRANDS_MANAGE: "Catalog.Brands.Manage",
  CATEGORIES_MANAGE: "Catalog.Categories.Manage",

  BANNERS_MANAGE: "Marketing.Banners.Manage",
  SEARCH_INSIGHTS_VIEW: "Marketing.SearchInsights.View",

  DELIVERY_MANAGE: "Settings.Delivery.Manage",
  STORES_MANAGE: "Settings.Stores.Manage",
  COMPANY_PROFILE_MANAGE: "Settings.CompanyProfile.Manage",
  INTEGRATIONS_MANAGE: "Settings.Integrations.Manage",

  USERS_VIEW: "Users.View",
  USERS_MANAGE: "Users.Manage",
  USERS_DELETE: "Users.Delete",
  USERS_PROMOTE: "Users.Promote",
  SESSIONS_VIEW: "Users.Sessions.View",
  SESSIONS_REVOKE: "Users.Sessions.Revoke",

  ROLES_VIEW: "Access.Roles.View",
  ROLES_MANAGE: "Access.Roles.Manage",
  PERMISSIONS_MANAGE: "Access.Permissions.Manage",

  ORDERS_VIEW: "Orders.View",
  PRESCRIPTIONS_VIEW: "Prescriptions.View",
  PRESCRIPTIONS_REVIEW: "Prescriptions.Review",
  NOTIFICATIONS_SEND: "Notifications.Send",
  REPORTS_VIEW: "Reports.View",
  AUDIT_VIEW: "Audit.View",
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/** Platform roles checked by role (host-level actions with no tenant permission rows). */
export const PLATFORM_ROLES = {
  DEV: "Dev",
  SUPPORT: "Support",
  SUPER_ADMIN: "SuperAdmin",
  ADMIN: "Admin",
} as const;

export const hasRole = (userRoles: string[], roles: string[]): boolean => {
  const normalized = userRoles.map((r) => r.trim().toLowerCase());
  return roles.some((r) => normalized.includes(r.trim().toLowerCase()));
};
