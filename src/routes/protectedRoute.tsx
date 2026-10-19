import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useTypedSelector } from "@/app/hook";

import {
  AUTH_ROUTES,
  PROTECTED_ROUTES,
} from "./common/routePath";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const normalizeRole = (
  role: string,
) => role.trim().toLowerCase();

const ProtectedRoute = ({
  allowedRoles,
}: ProtectedRouteProps) => {
  const {
    isAuthenticated,
    isInitialized,
    user,
  } = useTypedSelector(
    (state) => state.auth,
  );

  /**
   * Authentication is still being resolved.
   *
   * Do NOT redirect yet.
   *
   * This is especially important when the access
   * token is expired but the refresh token is valid.
   */
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-muted-foreground">
          Authenticating...
        </div>
      </div>
    );
  }

  /**
   * Authentication has finished and the user
   * is genuinely unauthenticated.
   */
  if (!isAuthenticated) {
    return (
      <Navigate
        to={AUTH_ROUTES.SIGN_IN}
        replace
      />
    );
  }

  /**
   * No role restriction.
   */
  if (!allowedRoles?.length) {
    return <Outlet />;
  }

  const userRoles =
    (user?.roles ?? [])
      .filter(Boolean)
      .map(normalizeRole);

  const requiredRoles =
    allowedRoles
      .filter(Boolean)
      .map(normalizeRole);

  const hasRequiredRole =
    userRoles.some(
      (userRole) =>
        requiredRoles.includes(
          userRole,
        ),
    );

  if (!hasRequiredRole) {
    return (
      <Navigate
        to={
          PROTECTED_ROUTES.OVERVIEW
        }
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;