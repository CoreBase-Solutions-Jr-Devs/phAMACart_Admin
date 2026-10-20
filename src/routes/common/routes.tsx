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

/** Back-office roles (the API's SuperAdminOnly policy). */
export const ADMIN_ROLES = ["SuperAdmin", "Admin", "Dev", "Support"];

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
];

export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.OVERVIEW, element: <Overview /> },
  { path: PROTECTED_ROUTES.PRODUCTS, element: <Products /> },
  { path: PROTECTED_ROUTES.PRESCRIPTIONS, element: <Prescriptions /> },
  { path: PROTECTED_ROUTES.COMPANYPROFILE, element: <CompanyProfile /> },
  { path: PROTECTED_ROUTES.CATEGORIES, element: <Categories /> },
  { path: PROTECTED_ROUTES.BANNER, element: <Banners /> },
  { path: PROTECTED_ROUTES.BRANDS, element: <Brands /> },
  { path: PROTECTED_ROUTES.STORES, element: <Stores /> },
  { path: PROTECTED_ROUTES.DELIVERYSETTINGS, element: <DeliverySettingsPage /> },
  { path: PROTECTED_ROUTES.SETTINGS, element: <Settings /> },
  { path: PROTECTED_ROUTES.REPORTS, element: <Reports /> },
  { path: PROTECTED_ROUTES.REPORT_VIEW, element: <ReportView /> },
  { path: PROTECTED_ROUTES.ORDERS, element: <Orders /> },
  { path: PROTECTED_ROUTES.SEARCH_INSIGHTS, element: <SearchInsights /> },
  { path: PROTECTED_ROUTES.INTEGRATIONS, element: <Integrations /> },
];

export const adminRoutePaths = [
  { path: PROTECTED_ROUTES.ACCESS, element: <AccessControl /> },
  { path: PROTECTED_ROUTES.AUDIT_LOGS, element: <AuditLogs /> },
  { path: PROTECTED_ROUTES.SYSTEM_HEALTH, element: <SystemHealth /> },
];

export const devSupportRoutePaths = [
  {
    path: PROTECTED_ROUTES.TENANTPROVISION,
    element: <TenantProvision />,
  },
  {
    path: PROTECTED_ROUTES.USERS,
    element: <Users />
  },
  {
    path: PROTECTED_ROUTES.TENANTS,
    element: <Tenants />,
  }
];
