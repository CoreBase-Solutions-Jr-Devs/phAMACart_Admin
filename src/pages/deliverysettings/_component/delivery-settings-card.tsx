import { Card, CardContent } from "@/components/ui/card";

import DeliverySettingsForm from "./delivery-settings-form";
// import ApiKeyRotationForm from "./api-key-rotation-form";

import { DeliverySettings } from "@/features/deliverysettings/deliverySettingsType";

interface Props {
  data?: { deliverySettings: DeliverySettings };
  isError?: boolean;
}

const DeliverySettingsCard = ({ data, isError }: Props) => {
  const settings = data?.deliverySettings;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
      <Card className="border-none shadow-none sm:border sm:shadow-sm">
        <CardContent className="px-0 sm:px-6 space-y-8">
          {isError ? (
            <p className="text-sm text-red-500">
              Failed to load delivery settings.
            </p>
          ) : (
            <>
              <DeliverySettingsForm settings={settings} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliverySettingsCard;