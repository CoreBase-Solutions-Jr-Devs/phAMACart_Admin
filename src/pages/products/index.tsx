import PageLayout from "@/components/page-layout";
import PageGuide from "@/components/page-guide";
import ProductsTable from "./_component/products-table";
import { productsPageGuide } from "./_component/data";

const Products = () => {
  return (
    <PageLayout
      title="Products"
      subtitle="Manage your product inventory, stock, and pricing."
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <ProductsTable />
      </div>

      <PageGuide {...productsPageGuide} />
    </PageLayout>
  );
};

export default Products; 