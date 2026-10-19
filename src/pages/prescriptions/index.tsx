import PageLayout from "@/components/page-layout";
import PrescriptionsTable from "./_component/prescriptions-table";

const Prescriptions = () => {
  return (
    <PageLayout
      title="Prescriptions"
      subtitle="Manage client prescription requests."
    >
      <div className="mx-auto mt-4 w-full max-w-[1600px]">
        <PrescriptionsTable />
      </div>
    </PageLayout>
  );
};

export default Prescriptions;