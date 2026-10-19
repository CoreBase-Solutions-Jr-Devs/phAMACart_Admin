import PageLayout from "@/components/page-layout";
import StoresTable from "./_component/stores-table";

const Stores = () => {
  return (
    <PageLayout
      title="Stores"
      subtitle="View and update your stores' public details, contacts and addresses."
    >
      <div className="mx-auto mt-4 w-full max-w-[1600px]">
        <StoresTable />
      </div>
    </PageLayout>
  );
};

export default Stores;
