import PageLayout from "@/components/page-layout";
import ProductsTable from "./_component/products-table";

const Products = () => {
  return (
    <PageLayout
      title="Products"
      subtitle="Manage your product inventory, stock, and pricing."
    >
      <div className="w-full mt-4">
        <ProductsTable />
      </div>
    </PageLayout>
  );
};

export default Products;