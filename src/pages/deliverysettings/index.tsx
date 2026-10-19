import PageLayout from "@/components/page-layout";
import DeliverySettingsCard from "./_component/delivery-settings-card";
import { useGetDeliverySettingsQuery } from "@/features/deliverysettings/deliverySettingsAPI";

const DeliverySettingsPage = () => {
  const { data, isLoading, isError } = useGetDeliverySettingsQuery();

  return (
    <PageLayout
      title="Delivery Settings"
      subtitle="Configure pricing, VAT, delivery origin coordinates and distance calculation rules."
    >
      <div className="mx-auto w-full max-w-[1600px]">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">
            Loading delivery settings...
          </div>
        ) : (
          <DeliverySettingsCard data={data} isError={isError} />
        )}
      </div>
    </PageLayout>
  );
};

export default DeliverySettingsPage;