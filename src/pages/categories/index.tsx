import PageLayout from "@/components/page-layout";
import CategoriesTable from "./_component/categories-table";

const Categories = () => {
  return (
    <PageLayout
      title="Categories"
      subtitle="Manage your category inventory and details."
    >
      <div className="w-full mt-4">
        <CategoriesTable />
      </div>
    </PageLayout>
  );
};

export default Categories;