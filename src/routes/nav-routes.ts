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

export type NavRoute = {
  icon: LucideIcon;
  href: string;
  label: string;
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
      },
      {
        icon: Bookmark,
        href: PROTECTED_ROUTES.BRANDS,
        label: "Brands",
      },
      {
        icon: Layers,
        href: PROTECTED_ROUTES.CATEGORIES,
        label: "Categories",
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
      },
      {
        icon: FileText,
        href: PROTECTED_ROUTES.PRESCRIPTIONS,
        label: "Prescriptions",
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
      },
      {
        icon: SearchCheck,
        href: PROTECTED_ROUTES.SEARCH_INSIGHTS,
        label: "Search Insights",
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
      },
      {
        icon: BusFront,
        href: PROTECTED_ROUTES.DELIVERYSETTINGS,
        label: "Delivery Settings",
      },
      {
        icon: Building2,
        href: PROTECTED_ROUTES.COMPANYPROFILE,
        label: "Company Profile",
      },
      {
        icon: Plug,
        href: PROTECTED_ROUTES.INTEGRATIONS,
        label: "Integrations",
      },
      {
        icon: ClipboardMinus,
        href: PROTECTED_ROUTES.REPORTS,
        label: "Reports",
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
        icon: ShieldCheck,
        href: PROTECTED_ROUTES.ACCESS,
        label: "Roles & Permissions",
        roles: ["SuperAdmin", "Admin", "Dev", "Support"],
      },
      {
        icon: ScrollText,
        href: PROTECTED_ROUTES.AUDIT_LOGS,
        label: "Audit Logs",
        roles: ["SuperAdmin", "Admin", "Dev", "Support"],
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
        roles: ["Dev", "Support"],
      },
      {
        icon: ServerCog,
        href: PROTECTED_ROUTES.TENANTPROVISION,
        label: "Provision Tenant",
        roles: ["Dev", "Support"],
      },
      {
        icon: UserCheck,
        href: PROTECTED_ROUTES.USERS,
        label: "Users",
        roles: ["Dev", "Support"],
      }
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
 * Routes without a roles property are visible to everyone.
 */
export const hasNavAccess = (
  routeRoles: string[] | undefined,
  userRoles: string[],
): boolean => {
  if (!routeRoles?.length) {
    return true;
  }

  const normalizedUserRoles = userRoles.map((role) =>
    role.trim().toLowerCase(),
  );

  return routeRoles.some((role) =>
    normalizedUserRoles.includes(role.trim().toLowerCase()),
  );
};

/**
 * Returns only navigation sections/routes available to the user.
 *
 * Empty sections are removed automatically.
 */
export const getVisibleNavSections = (
  userRoles: string[],
): NavSection[] => {
  return NAV_SECTIONS.map((section) => ({
    ...section,
    routes: section.routes.filter((route) =>
      hasNavAccess(route.roles, userRoles),
    ),
  })).filter((section) => section.routes.length > 0);
};

/**
 * Returns only navigation routes available to the user.
 */
export const getVisibleNavRoutes = (
  userRoles: string[],
): NavRoute[] => {
  return NAV_ROUTES.filter((route) =>
    hasNavAccess(route.roles, userRoles),
  );
};