import PageLayout from "@/components/page-layout";
import { ProvisionTenantForm } from "./_component/provision-tenant-form";

const TenantProvision = () => {
  return (
    <PageLayout
      title="Provision Tenant"
      subtitle="Create and configure a new tenant, database, company profile, domains, users and integrations."
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <ProvisionTenantForm />
      </div>
    </PageLayout>
  );
};

export default TenantProvision;