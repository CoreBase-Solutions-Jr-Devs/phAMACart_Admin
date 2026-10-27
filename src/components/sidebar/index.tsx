import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import usePermissions from "@/hooks/use-permissions";
import {
  getVisibleNavSections,
} from "@/routes/nav-routes";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/use-auth";

const SIDEBAR_COLLAPSED_KEY = "sidebar:collapsed";

const getInitialCollapsed = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.localStorage.getItem(
      SIDEBAR_COLLAPSED_KEY,
    ) === "1"
  );
};

const SideBar = () => {
  const { pathname } = useLocation();

  const [collapsed, setCollapsed] = useState(
    getInitialCollapsed,
  );

  const { data } = useAuth();

  const userRoles = data?.user?.roles ?? [];

  const { can } = usePermissions();

  const navSections = getVisibleNavSections(userRoles, can);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;

      window.localStorage.setItem(
        SIDEBAR_COLLAPSED_KEY,
        next ? "1" : "0",
      );

      return next;
    });
  };

  return (
    <div
      className={cn(
        "hidden h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 lg:flex",
        collapsed ? "w-[68px]" : "w-[215px]",
      )}
    >
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <ul className="flex flex-col gap-y-4 p-3">
          {navSections.map((section) => (
            <li key={section.label}>
              {!collapsed && (
                <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-sidebar-foreground/50">
                  {section.label}
                </p>
              )}

              <ul className="flex flex-col gap-y-1">
                {section.routes.map((route) => {
                  const Icon = route.icon;

                  const isActive =
                    pathname === route.href ||
                    pathname.startsWith(
                      `${route.href}/`,
                    );

                  return (
                    <li key={route.href}>
                      <NavLink
                        to={route.href}
                        className={cn(
                          "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-sidebar-foreground/80 transition-colors",
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sidebar-ring",
                          isActive &&
                            "bg-sidebar-accent text-sidebar-accent-foreground",
                          collapsed &&
                            "justify-center px-0",
                        )}
                        title={
                          collapsed
                            ? route.label
                            : undefined
                        }
                      >
                        <Icon className="size-5 shrink-0" />

                        {!collapsed && (
                          <span className="truncate">
                            {route.label}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapsed}
          className={cn(
            "w-full text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            !collapsed &&
              "justify-start gap-2 px-3",
          )}
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          title={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
        >
          {collapsed ? (
            <ChevronsRight className="size-4" />
          ) : (
            <>
              <ChevronsLeft className="size-4" />
              <span className="text-sm">
                Collapse
              </span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SideBar;