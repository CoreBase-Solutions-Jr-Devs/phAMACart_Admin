import PageLayout from "@/components/page-layout";
import StoresTable from "./_component/stores-table";

const Stores = () => {
  return (
    <PageLayout
      title="Stores"
      subtitle="View and update your stores' public details, contacts and addresses."
    >
      <div className="w-full h-auto">
        <StoresTable />
      </div>
    </PageLayout>
  );
};

export default Stores;
