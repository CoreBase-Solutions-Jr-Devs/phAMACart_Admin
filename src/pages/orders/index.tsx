import PageLayout from "@/components/page-layout";
import OrdersTable from "./_component/orders-table";

const Orders = () => (
  <PageLayout
    title="Orders"
    subtitle="Every order placed on the storefront, with payment and fulfilment status."
  >
    <div className="mx-auto mt-4 w-full max-w-[1600px]">
      <OrdersTable />
    </div>
  </PageLayout>
);

export default Orders;
