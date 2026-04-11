import PageLayout from "@/components/page-layout";
import BrandTable from "./_component/brands-table";
import { Button } from "@/components/ui/button";
import { BrandFormDialog } from "./_component/brand-form-dialog";
import { PlusIcon } from "lucide-react";

const Categories = () => {
  return (
    <PageLayout
      title="Brands"
      subtitle="Manage your brand inventory and details."
      rightAction={
        <BrandFormDialog>
          <Button className="pr-7!">
            <PlusIcon />
            Create Brand
          </Button>
        </BrandFormDialog>
      }
    >
      <div className="w-full mt-4">
        <BrandTable />
      </div>
    </PageLayout>
  );
};

export default Categories;
