import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import usePermissions from "@/hooks/use-permissions";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";

type PermissionGateProps = {
  /** Any one of these permissions grants access. */
  permission?: string | string[];
  /** Any one of these roles grants access (platform pages such as Tenants). */
  roles?: string[];
  children: ReactNode;
  /** Render this instead of redirecting (for buttons and sections). */
  fallback?: ReactNode;
};

/**
 * Shows its children only when the user has the permission (or role).
 * Pages redirect to Overview; pass `fallback` to hide a button or section instead.
 */
const PermissionGate = ({ permission, roles, children, fallback }: PermissionGateProps) => {
  const { can, hasAnyRole, isLoading } = usePermissions();

  if (isLoading) {
    return fallback !== undefined ? null : (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const allowed =
    (permission === undefined || can(permission)) &&
    (roles === undefined || hasAnyRole(roles));

  if (allowed) {
    return <>{children}</>;
  }

  return fallback !== undefined ? <>{fallback}</> : <Navigate to={PROTECTED_ROUTES.OVERVIEW} replace />;
};

export default PermissionGate;
