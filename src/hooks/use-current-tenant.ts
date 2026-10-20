import { useEffect } from "react";

import { useResolveTenantQuery } from "@/features/tenants/tenantsAPI";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { setTenant, clearTenant } from "@/features/tenants/tenantsSlice";

const useCurrentTenant = () => {
  const dispatch = useAppDispatch();
  const host = window.location.host.toLowerCase();

  const currentTenant = useTypedSelector(
    (state) => state.tenant.currentTenant,
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useResolveTenantQuery(host);

  useEffect(() => {
    if (isLoading || isFetching) {
      return;
    }

    if (data) {
      dispatch(setTenant(data));
    } else if (isError) {
      dispatch(clearTenant());
      console.error(`No tenant configured for host: ${host}`);
    }
  }, [data, isLoading, isFetching, isError, host, dispatch]);

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
