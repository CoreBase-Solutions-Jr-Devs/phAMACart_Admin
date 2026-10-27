import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Megaphone,
  Settings2,
  Bookmark,
  Building2,
  Building,
  BusFront,
  FileText,
  ServerCog,
  type LucideIcon,
  ClipboardMinus,
  UserCheck,
  ShoppingCart,
  SearchCheck,
  Plug,
  ShieldCheck,
  ScrollText,
  Activity,
  Network,
} from "lucide-react";

import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { PERMISSIONS, PLATFORM_ROLES, hasRole } from "@/lib/permissions";

export type NavRoute = {
  icon: LucideIcon;
  href: string;
  label: string;
  /** Visible when the user holds any of these permissions. */
  permission?: string | string[];
  /** Visible when the user holds any of these roles (platform pages). */
  roles?: string[];
};

export type NavSection = {
  label: string;
  routes: NavRoute[];
};

/**
 * Single source of truth for primary navigation.
 *
 * Desktop and mobile navigation should both consume this
 * configuration.
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Overview",
    routes: [
      {
        icon: LayoutDashboard,
        href: PROTECTED_ROUTES.OVERVIEW,
        label: "Overview",
      },
    ],
  },

  {
    label: "Catalog",
    routes: [
      {
        icon: ShoppingBag,
        href: PROTECTED_ROUTES.PRODUCTS,
        label: "Products",
        permission: PERMISSIONS.CATALOG_VIEW,
      },
      {
        icon: Bookmark,
        href: PROTECTED_ROUTES.BRANDS,
        label: "Brands",
        permission: PERMISSIONS.CATALOG_VIEW,
      },
      {
        icon: Layers,
        href: PROTECTED_ROUTES.CATEGORIES,
        label: "Categories",
        permission: PERMISSIONS.CATALOG_VIEW,
      },
    ],
  },

  {
    label: "Sales",
    routes: [
      {
        icon: ShoppingCart,
        href: PROTECTED_ROUTES.ORDERS,
        label: "Orders",
        permission: PERMISSIONS.ORDERS_VIEW,
      },
      {
        icon: FileText,
        href: PROTECTED_ROUTES.PRESCRIPTIONS,
        label: "Prescriptions",
        permission: PERMISSIONS.PRESCRIPTIONS_VIEW,
      },
    ],
  },

  {
    label: "Marketing",
    routes: [
      {
        icon: Megaphone,
        href: PROTECTED_ROUTES.BANNER,
        label: "Banners",
        permission: PERMISSIONS.BANNERS_MANAGE,
      },
      {
        icon: SearchCheck,
        href: PROTECTED_ROUTES.SEARCH_INSIGHTS,
        label: "Search Insights",
        permission: PERMISSIONS.SEARCH_INSIGHTS_VIEW,
      },
    ],
  },

  {
    label: "Management",
    routes: [
      {
        icon: Building,
        href: PROTECTED_ROUTES.STORES,
        label: "Stores",
        permission: PERMISSIONS.STORES_MANAGE,
      },
      {
        icon: BusFront,
        href: PROTECTED_ROUTES.DELIVERYSETTINGS,
        label: "Delivery Settings",
        permission: PERMISSIONS.DELIVERY_MANAGE,
      },
      {
        icon: Building2,
        href: PROTECTED_ROUTES.COMPANYPROFILE,
        label: "Company Profile",
        permission: PERMISSIONS.COMPANY_PROFILE_MANAGE,
      },
      {
        icon: Plug,
        href: PROTECTED_ROUTES.INTEGRATIONS,
        label: "Integrations",
        permission: PERMISSIONS.INTEGRATIONS_MANAGE,
      },
      {
        icon: ClipboardMinus,
        href: PROTECTED_ROUTES.REPORTS,
        label: "Reports",
        permission: PERMISSIONS.REPORTS_VIEW,
      },
      {
        icon: Settings2,
        href: PROTECTED_ROUTES.SETTINGS,
        label: "Settings",
      },
    ],
  },

  {
    label: "Administration",
    routes: [
      {
        icon: UserCheck,
        href: PROTECTED_ROUTES.USERS,
        label: "Users & Sessions",
        permission: [PERMISSIONS.USERS_VIEW, PERMISSIONS.SESSIONS_VIEW],
      },
      {
        icon: ShieldCheck,
        href: PROTECTED_ROUTES.ACCESS,
        label: "Roles & Permissions",
        permission: PERMISSIONS.ROLES_VIEW,
      },
      {
        icon: ScrollText,
        href: PROTECTED_ROUTES.AUDIT_LOGS,
        label: "Audit Logs",
        permission: PERMISSIONS.AUDIT_VIEW,
      },
      {
        icon: Activity,
        href: PROTECTED_ROUTES.SYSTEM_HEALTH,
        label: "System Health",
        roles: ["SuperAdmin", "Admin", "Dev", "Support"],
      },
    ],
  },

  {
    label: "Developer",
    routes: [
      {
        icon: Network,
        href: PROTECTED_ROUTES.TENANTS,
        label: "Tenants",
        roles: [PLATFORM_ROLES.DEV, PLATFORM_ROLES.SUPPORT],
      },
      {
        icon: ServerCog,
        href: PROTECTED_ROUTES.TENANTPROVISION,
        label: "Provision Tenant",
        // Only developers may create tenants (API policy "ProvisionTenant").
        roles: [PLATFORM_ROLES.DEV],
      },
    ],
  },
];

/**
 * Flat list of all navigation routes.
 */
export const NAV_ROUTES: NavRoute[] = NAV_SECTIONS.flatMap(
  (section) => section.routes,
);

/**
 * Determines whether a user can see a navigation route.
 *
 * Routes with neither `permission` nor `roles` are visible to everyone.
 */
export const hasNavAccess = (
  route: Pick<NavRoute, "permission" | "roles">,
  userRoles: string[],
  can: (permission: string | string[] | undefined) => boolean,
): boolean => {
  if (route.roles?.length && !hasRole(userRoles, route.roles)) {
    return false;
  }

  return can(route.permission);
};

/**
 * Returns only navigation sections/routes available to the user.
 *
 * Empty sections are removed automatically.
 */
export const getVisibleNavSections = (
  userRoles: string[],
  can: (permission: string | string[] | undefined) => boolean,
): NavSection[] => {
  return NAV_SECTIONS.map((section) => ({
    ...section,
    routes: section.routes.filter((route) =>
      hasNavAccess(route, userRoles, can),
    ),
  })).filter((section) => section.routes.length > 0);
};

/**
 * Returns only navigation routes available to the user.
 */
export const getVisibleNavRoutes = (
  userRoles: string[],
  can: (permission: string | string[] | undefined) => boolean,
): NavRoute[] => {
  return NAV_ROUTES.filter((route) =>
    hasNavAccess(route, userRoles, can),
  );
};
