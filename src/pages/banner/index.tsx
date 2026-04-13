import PageLayout from "@/components/page-layout";
import BannersTable from "./_component/banners-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewBannerFormDialog } from "./_component/create-banner-form-dialog";

const Banner = () => {
  return (
    <PageLayout
      title="Banners"
      subtitle="Manage your banner, promotions and sales."
      rightAction={
        <NewBannerFormDialog>
          <Button className="pr-7!">
            <PlusIcon />
            Create Banner
          </Button>
        </NewBannerFormDialog>
      }
    >
      <div className="w-full mt-4">
        <BannersTable />
      </div>
    </PageLayout>
  );
};

export default Banner;
