import { useEffect } from "react";

import {
  useGetTenantsQuery,
  type TenantConfig,
} from "@/features/tenants/tenantsAPI";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { setTenant, clearTenant } from "@/features/tenants/tenantsSlice";

const useCurrentTenant = () => {
  const dispatch = useAppDispatch();

  const currentTenant = useTypedSelector(
    (state) => state.tenant.currentTenant,
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetTenantsQuery();

  useEffect(() => {
    if (isLoading || isFetching || !data?.data) {
      return;
    }

    const host = window.location.host.toLowerCase();

    const tenant = data.data.find(
      (item: TenantConfig) =>
        item.clientHost?.toLowerCase() === host ||
        item.adminHost?.toLowerCase() === host,
    );

    if (tenant) {
      dispatch(setTenant(tenant));
    } else {
      dispatch(clearTenant());

      console.error(
        `No tenant configured for host: ${host}`,
      );
    }
  }, [
    data,
    isLoading,
    isFetching,
    dispatch,
  ]);

  return {
    tenant: currentTenant,
    tenantId: currentTenant?.id ?? "",
    initialized: !isLoading && !isFetching,
    isLoading,
    isError,
    error,
  };
};

export default useCurrentTenant;