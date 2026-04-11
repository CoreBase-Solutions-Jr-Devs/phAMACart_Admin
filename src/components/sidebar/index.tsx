import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { NavLink, useLocation } from "react-router-dom";
import {
  Package,
  Tag,
  Home,
  Key,
  Settings,
  ClipboardList,
  Star,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SideBar = () => {
  const { pathname } = useLocation();

  const routes = [
    {
      icon: Home,
      href: PROTECTED_ROUTES.OVERVIEW,
      label: "Overview",
    },
    {
      icon: Package,
      href: PROTECTED_ROUTES.PRODUCTS,
      label: "Products",
    },
    {
      icon: Tag,
      href: PROTECTED_ROUTES.BRANDS,
      label: "Brands",
    },
    {
      icon: Tag,
      href: PROTECTED_ROUTES.CATEGORIES,
      label: "Categories",
    },
    {
      icon: Flag,
      href: PROTECTED_ROUTES.BANNER,
      label: "Banners",
    },
    {
      icon: ClipboardList,
      href: PROTECTED_ROUTES.APIKEYS,
      label: "Orders",
    },
    {
      icon: Star,
      href: PROTECTED_ROUTES.SETTINGS,
      label: "Reviews",
    },
    {
      icon: Settings,
      href: PROTECTED_ROUTES.SETTINGS,
      label: "Settings",
    },
  ];

  return (
    <div className="hidden lg:flex w-screen sticky shrink-0 top-20 flex-col sm:w-[215px] h-full">
      <nav>
        <ul
          className="flex flex-row justify-between gap-x-4 gap-y-2 p-4
        text-center sm:flex-col sm:p-6 sm:text-left"
        >
          {routes.map((route, i) => {
            const Icon = route.icon;
            return (
              <li key={i}>
                <NavLink
                  className={cn(
                    "rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-secondary hover:!text-secondary-foreground flex h-max flex-col items-center justify-center gap-2 px-2 py-1.5 font-medium sm:h-10 sm:flex-row sm:justify-start sm:px-4 sm:text-sm bg-transparent text-foreground",
                    pathname === route.href && "bg-secondary",
                  )}
                  to={route.href}
                >
                  <Icon className="size-5" />
                  <span className="sr-only line-clamp-2 sm:not-sr-only">
                    {route.label}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
