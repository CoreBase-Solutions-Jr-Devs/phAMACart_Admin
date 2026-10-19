import PageLayout from "@/components/page-layout";
import CategoriesTable from "./_component/categories-table";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewCategoryFormDialog } from "./_component/new_category-form-dialog";

const Categories = () => {
  return (
    <PageLayout
      title="Categories"
      subtitle="Manage your category inventory and details."
      rightAction={
        <NewCategoryFormDialog>
          <Button className="pr-7!">
            <PlusIcon />
            Create Category
          </Button>
        </NewCategoryFormDialog>
      }
    >
      <div className="mx-auto mt-4 w-full max-w-[1600px]">
        <CategoriesTable />
      </div>
    </PageLayout>
  );
};

export default Categories;
