export const isAuthRoute = (pathname: string): boolean => {
  return Object.values(AUTH_ROUTES).includes(pathname);
};

export const AUTH_ROUTES = {
  SIGN_IN: "/",
  SIGN_UP: "/sign-up",
};

export const PROTECTED_ROUTES = {
  OVERVIEW: "/overview",
  ORDERS: "/orders",
  REPORT_VIEW: "/reports/:reportId",
  SEARCH_INSIGHTS: "/search-insights",
  INTEGRATIONS: "/integrations",
  ACCESS: "/roles",
  AUDIT_LOGS: "/audit-logs",
  SYSTEM_HEALTH: "/system-health",
  TENANTS: "/tenants",
  FEATURE_FLAGS: "/feature-flags",
  COMPANYPROFILE: "/company-profile",
  PRODUCTS: "/products",
  PRESCRIPTIONS: "/prescriptions",
  CATEGORIES: "/categories",
  BANNER: "/banner",
  BRANDS: "/brands",
  STORES: "/stores",
  DELIVERYSETTINGS: "/deliverysettings",
  TENANTPROVISION: "/tenant-provision",
  USERS: "/users",
  REPORTS: "/reports",
  SETTINGS: "/settings",
};
