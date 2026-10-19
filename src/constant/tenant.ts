import type { TenantConfig } from "@/features/tenants/tenantsAPI";

export const getCurrentTenantId = (
  tenants: TenantConfig[],
): string => {
  const host = window.location.host.toLowerCase();

  return (
    tenants.find(
      (tenant) =>
        tenant.clientHost?.toLowerCase() === host ||
        tenant.adminHost?.toLowerCase() === host,
    )?.id ?? ""
  );
};