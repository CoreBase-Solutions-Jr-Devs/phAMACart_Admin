import CompanyProfile from "@/pages/companyprofile";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "./routePath";
import SignIn from "@/pages/auth/sign-in";
import Overview from "@/pages/overview";
import Settings from "@/pages/settings";
import Products from "@/pages/products";
import Categories from "@/pages/categories";
import Banners from "@/pages/banner";
import Brands from "@/pages/brands";
import Stores from "@/pages/stores";
import DeliverySettingsPage from "@/pages/deliverysettings";
import Prescriptions from "@/pages/prescriptions";
import TenantProvision from "@/pages/tenantonboarding";
import Reports from "@/pages/reports";
import Users from "@/pages/users";
import Orders from "@/pages/orders";
import ReportView from "@/pages/reports/view";
import SearchInsights from "@/pages/search-insights";
import Integrations from "@/pages/integrations";
import AccessControl from "@/pages/access";
import AuditLogs from "@/pages/audit";
import SystemHealth from "@/pages/system-health";
import Tenants from "@/pages/tenants";
import FeatureFlags from "@/pages/feature-flags";
import PermissionGate from "@/components/permission-gate";
import { PERMISSIONS, PLATFORM_ROLES } from "@/lib/permissions";
import type { ReactNode } from "react";

/** Wraps a page so it redirects to Overview when the user lacks the permission. */
const guard = (element: ReactNode, permission?: string | string[], roles?: string[]) => (
  <PermissionGate permission={permission} roles={roles}>
    {element}
  </PermissionGate>
);

/** Back-office roles (the API's SuperAdminOnly policy). */
export const ADMIN_ROLES = ["SuperAdmin", "Admin", "Dev", "Support"];

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
];

export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.OVERVIEW, element: <Overview /> },
  { path: PROTECTED_ROUTES.PRODUCTS, element: guard(<Products />, PERMISSIONS.CATALOG_VIEW) },
  { path: PROTECTED_ROUTES.PRESCRIPTIONS, element: guard(<Prescriptions />, PERMISSIONS.PRESCRIPTIONS_VIEW) },
  { path: PROTECTED_ROUTES.COMPANYPROFILE, element: guard(<CompanyProfile />, PERMISSIONS.COMPANY_PROFILE_MANAGE) },
  { path: PROTECTED_ROUTES.CATEGORIES, element: guard(<Categories />, PERMISSIONS.CATALOG_VIEW) },
  { path: PROTECTED_ROUTES.BANNER, element: guard(<Banners />, PERMISSIONS.BANNERS_MANAGE) },
  { path: PROTECTED_ROUTES.BRANDS, element: guard(<Brands />, PERMISSIONS.CATALOG_VIEW) },
  { path: PROTECTED_ROUTES.STORES, element: guard(<Stores />, PERMISSIONS.STORES_MANAGE) },
  { path: PROTECTED_ROUTES.DELIVERYSETTINGS, element: guard(<DeliverySettingsPage />, PERMISSIONS.DELIVERY_MANAGE) },
  { path: PROTECTED_ROUTES.SETTINGS, element: <Settings /> },
  { path: PROTECTED_ROUTES.REPORTS, element: guard(<Reports />, PERMISSIONS.REPORTS_VIEW) },
  { path: PROTECTED_ROUTES.REPORT_VIEW, element: guard(<ReportView />, PERMISSIONS.REPORTS_VIEW) },
  { path: PROTECTED_ROUTES.ORDERS, element: guard(<Orders />, PERMISSIONS.ORDERS_VIEW) },
  { path: PROTECTED_ROUTES.SEARCH_INSIGHTS, element: guard(<SearchInsights />, PERMISSIONS.SEARCH_INSIGHTS_VIEW) },
  { path: PROTECTED_ROUTES.INTEGRATIONS, element: guard(<Integrations />, PERMISSIONS.INTEGRATIONS_MANAGE) },
];

export const adminRoutePaths = [
  { path: PROTECTED_ROUTES.ACCESS, element: guard(<AccessControl />, PERMISSIONS.ROLES_VIEW) },
  { path: PROTECTED_ROUTES.AUDIT_LOGS, element: guard(<AuditLogs />, PERMISSIONS.AUDIT_VIEW) },
  { path: PROTECTED_ROUTES.SYSTEM_HEALTH, element: <SystemHealth /> },
  {
    path: PROTECTED_ROUTES.USERS,
    element: guard(<Users />, [PERMISSIONS.USERS_VIEW, PERMISSIONS.SESSIONS_VIEW]),
  },
];

export const devSupportRoutePaths = [
  {
    path: PROTECTED_ROUTES.TENANTPROVISION,
    // API policy "ProvisionTenant": developers only.
    element: guard(<TenantProvision />, undefined, [PLATFORM_ROLES.DEV]),
  },
  {
    path: PROTECTED_ROUTES.FEATURE_FLAGS,
    // API policy "ManageFeatures": developers only.
    element: guard(<FeatureFlags />, undefined, [PLATFORM_ROLES.DEV]),
  },
  {
    path: PROTECTED_ROUTES.TENANTS,
    element: <Tenants />,
  }
];
