import { useEffect } from "react";
import { useResolveTenantQuery } from "@/features/tenants/tenantsAPI";
import { clearTenant, setTenant } from "@/features/tenants/tenantsSlice";
import { useAppDispatch } from "@/app/hook";

/** Resolves the tenant for this host once, before anything calls the API. */
const TenantInitializer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const host = window.location.host.toLowerCase();

  const { data, isError, isLoading, isFetching } =
    useResolveTenantQuery(host);

  useEffect(() => {
    if (isLoading || isFetching) {
      return;
    }

    if (data) {
      dispatch(setTenant(data));
      return;
    }

    if (isError) {
      console.error(`No tenant found for host: ${host}`);
      dispatch(clearTenant());
    }
  }, [data, isError, isLoading, isFetching, host, dispatch]);

  return <>{children}</>;
};

export default TenantInitializer;
