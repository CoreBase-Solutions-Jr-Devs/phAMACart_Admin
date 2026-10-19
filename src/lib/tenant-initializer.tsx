import { useEffect } from "react";
import { useGetTenantsQuery } from "@/features/tenants/tenantsAPI";
import { clearTenant, setTenant } from "@/features/tenants/tenantsSlice";
import { useAppDispatch } from "@/app/hook";

const TenantInitializer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();

  const {
    data,
    isLoading,
    isFetching,
  } = useGetTenantsQuery();

  useEffect(() => {
    if (isLoading || isFetching || !data?.data) {
      return;
    }

    const host = window.location.host.toLowerCase();

    const tenant = data.data.find(
      (item) =>
        item.clientHost?.toLowerCase() === host ||
        item.adminHost?.toLowerCase() === host
    );

    if (!tenant) {
      console.error(
        `No tenant found for host: ${host}`
      );

      dispatch(clearTenant());
      return;
    }

    console.log("Resolved tenant:", tenant);

    dispatch(setTenant(tenant));
  }, [
    data,
    isLoading,
    isFetching,
    dispatch,
  ]);

  return <>{children}</>;
};

export default TenantInitializer;