import { useCallback, useMemo } from "react";

import { useTypedSelector } from "@/app/hook";
import { useGetMyPermissionsQuery } from "@/features/identity/accessAPI";
import { hasRole } from "@/lib/permissions";

/**
 * The signed-in user's permissions in the current tenant
 * (GET /v1/admin/identity/me/permissions). The API is the source of truth;
 * this only decides what to show.
 */
const usePermissions = () => {
  const { isAuthenticated, user } = useTypedSelector((state) => state.auth);

  const { data, isLoading, isFetching } = useGetMyPermissionsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const roles = useMemo(() => user?.roles ?? [], [user?.roles]);

  const codes = useMemo(
    () => new Set((data?.permissions ?? []).map((p) => p.toLowerCase())),
    [data?.permissions],
  );

  /** True when the user holds at least one of the given permissions. */
  const can = useCallback(
    (permission: string | string[] | undefined) => {
      if (!permission || (Array.isArray(permission) && permission.length === 0)) {
        return true;
      }
      const list = Array.isArray(permission) ? permission : [permission];
      return list.some((p) => codes.has(p.toLowerCase()));
    },
    [codes],
  );

  const hasAnyRole = useCallback((r: string[]) => hasRole(roles, r), [roles]);

  return {
    can,
    hasAnyRole,
    roles,
    permissions: data?.permissions ?? [],
    isLoading: isAuthenticated && (isLoading || (isFetching && !data)),
  };
};

export default usePermissions;
