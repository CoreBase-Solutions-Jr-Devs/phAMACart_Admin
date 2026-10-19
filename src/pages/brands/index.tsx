import PageLayout from "@/components/page-layout";
import BrandTable from "./_component/brands-table";
import { Button } from "@/components/ui/button";
import { BrandFormDialog } from "./_component/brand-form-dialog";
import { PlusIcon } from "lucide-react";

const Brands = () => {
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
      <div className="mx-auto mt-4 w-full max-w-[1600px]">
        <BrandTable />
      </div>
    </PageLayout>
  );
};

export default Brands;