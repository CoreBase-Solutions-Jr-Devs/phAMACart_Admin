import { useState } from "react";
import { Menu, Monitor, Moon, Sun } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils"; 
import Logo from "../logo/logo";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader } from "../ui/sheet";
import { UserNav } from "./user-nav";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { logout } from "@/features/auth/authSlice";
import { useSignOutMutation } from "@/features/auth/authAPI";
import { useTheme } from "@/context/theme-provider";
import NotificationBell from "../notifications/notification-bell";
import { getVisibleNavRoutes } from "@/routes/nav-routes";
import usePermissions from "@/hooks/use-permissions";

const Navbar = () => {
  const { pathname } = useLocation();
  const { user } = useTypedSelector((state) => state.auth);
  const { can } = usePermissions();
  const visibleRoutes = getVisibleNavRoutes(user?.roles ?? [], can);

  const { theme, setTheme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [signOut] = useSignOutMutation();

  const handleLogout = async () => {
    // Revoke the server-side session first; sign out locally regardless.
    try {
      await signOut().unwrap();
    } catch {
      // Expired/invalid token: nothing left to revoke.
    } finally {
      dispatch(logout());
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      {/* No sticky/mx-auto/max-w-7xl here — the header lives inside the
          right-hand column of AppLayout's flex shell, so it should simply
          fill that column edge to edge. */}
      <header className="z-40 flex h-16 w-full shrink-0 items-center justify-between gap-x-6 border-b bg-background px-4 sm:px-6 lg:px-8">
        <NavLogoAndUser username={user?.unique_name} handleOpen={handleOpen} />

        {/* Mobile Navigation — same filtered routes as the SideBar, so desktop
            and mobile nav can't drift out of sync. */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left" className="pt-0">
            <SheetHeader>
              <Logo />
            </SheetHeader>
            <nav className="flex flex-col gap-y-2 px-3">
              {visibleRoutes.map((route) => {
                const Icon = route.icon;
                return (
                  <NavLink
                    key={route.href}
                    className={cn(
                      "rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-secondary hover:!text-secondary-foreground flex h-max items-center gap-2 px-2 py-1.5 font-medium sm:h-10 flex-row justify-start sm:px-4 sm:text-sm bg-transparent text-foreground",
                      pathname === route.href && "bg-secondary"
                    )}
                    to={route.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="size-5" />
                    <span className="line-clamp-2">{route.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Right side - User actions */}
        <div className="flex items-center gap-4 sm:gap-8">
          <NotificationBell />

          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "dark" ? (
              <Moon className="w-5 h-5 transition-all" />
            ) : theme === "system" ? (
              <Monitor className="w-5 h-5 transition-all" />
            ) : (
              <Sun className="w-5 h-5 transition-all" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <UserNav
            userName={user?.unique_name || ""}
            profilePicture={""}
            onLogout={handleLogout}
          />
        </div>
      </header>
    </>
  );
};

const NavLogoAndUser = (props: {
  username?: string;
  handleOpen: () => void;
}) => {
  return (
    <div className="flex items-center gap-x-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="inline-flex lg:hidden !cursor-pointer
              text-black bg-black/10 dark:text-white dark:bg-white/10 dark:hover:bg-white/10"
          onClick={props.handleOpen}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <Logo />
      </div>
      <span className="hidden md:flex text-lg lg:text-4xl !text-muted-foreground !font-thin">
        /
      </span>
      <div className="hidden md:flex !items-center">
        <div className="!mr-1.5 flex !size-7 lg:!size-8 flex-shrink-0 !items-center justify-center rounded-md bg-primary p-1 font-bold !text-white text-sm lg:text-inherit uppercase">
          {props?.username?.charAt(0)}
        </div>
        <span className="z-10 truncate font-semibold !pt-[1.7px] text-sm lg:text-base">
          {props?.username || "no name"}
        </span>
      </div>
    </div>
  );
};

export default Navbar;