import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { parseError } from "@/lib/parse-error";

import { useUpdateDeliverySettingsMutation } from "@/features/deliverysettings/deliverySettingsAPI";
import { DeliverySettings } from "@/features/deliverysettings/deliverySettingsType";

const schema = z.object({
  ratePerKm: z.coerce.number().positive("Must be greater than 0."),
  minimumFee: z.coerce.number().min(0, "Cannot be negative."),
  vatRate: z.coerce
    .number()
    .min(0, "Must be between 0 and 1.")
    .max(1, "Must be between 0 and 1."),
  roundUpDistanceKm: z.boolean(),
  originLatitude: z.coerce.number().min(-90).max(90),
  originLongitude: z.coerce.number().min(-180).max(180),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  settings?: DeliverySettings;
}

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

const Field = ({ label, hint, error, children }: FieldProps) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-muted-foreground">
      {label}
    </label>

    {children}

    {hint && !error && (
      <p className="text-xs text-muted-foreground">{hint}</p>
    )}

    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const DeliverySettingsForm = ({ settings }: Props) => {
  const [updateDeliverySettings, { isLoading: isPending }] =
    useUpdateDeliverySettingsMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      ratePerKm: 0,
      minimumFee: 0,
      vatRate: 0,
      roundUpDistanceKm: false,
      originLatitude: 0,
      originLongitude: 0,
    },
  });

  // Re-run only when the settings entity changes (stable ID dep), not on every
  // individual field refetch.
  useEffect(() => {
    if (!settings) return;

    reset({
      ratePerKm: settings.ratePerKm,
      minimumFee: settings.minimumFee,
      vatRate: settings.vatRate,
      roundUpDistanceKm: settings.roundUpDistanceKm,
      originLatitude: settings.originLatitude,
      originLongitude: settings.originLongitude,
    });
  }, [settings?.id, reset]);

  const roundUpDistanceKm = watch("roundUpDistanceKm");

  const onSubmit = async (data: FormValues) => {
    // PUT — send the full resource every time. No partial-mapping needed,
    // no dirty-field tracking, no Mapster null→0 edge cases.
    try {
      await updateDeliverySettings(data).unwrap();

      toast.success("Delivery settings updated.");

      reset(data);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  // Do not render before settings load — prevents submitting all-zero defaults
  // while the initial GET is in flight.
  if (!settings) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Pricing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Rate / km" error={errors.ratePerKm?.message}>
          <Input
            type="number"
            step="0.01"
            placeholder="50"
            {...register("ratePerKm")}
          />
        </Field>

        <Field label="Minimum fee" error={errors.minimumFee?.message}>
          <Input
            type="number"
            step="0.01"
            placeholder="100"
            {...register("minimumFee")}
          />
        </Field>
      </div>

      <Field
        label="VAT rate"
        hint="Decimal between 0 and 1. e.g. 0.16 = 16%"
        error={errors.vatRate?.message}
      >
        <Input
          type="number"
          step="0.01"
          placeholder="0.16"
          className="w-full sm:max-w-[180px]"
          {...register("vatRate")}
        />
      </Field>

      {/* Coordinates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Origin latitude"
          error={errors.originLatitude?.message}
        >
          <Input
            type="number"
            step="any"
            placeholder="-1.2921"
            {...register("originLatitude")}
          />
        </Field>

        <Field
          label="Origin longitude"
          error={errors.originLongitude?.message}
        >
          <Input
            type="number"
            step="any"
            placeholder="36.8219"
            {...register("originLongitude")}
          />
        </Field>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-between gap-4 py-2">
        <div className="min-w-0">
          <p className="text-sm font-medium">Round up distance</p>

          <p className="text-xs text-muted-foreground">
            Round to the nearest km.
          </p>
        </div>

        <Switch
          checked={roundUpDistanceKm}
          onCheckedChange={(checked) =>
            setValue("roundUpDistanceKm", checked, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
      </div>

      {/* Submit */}
      <div className="flex justify-stretch sm:justify-end pt-2">
        <Button
          type="submit"
          size="sm"
          disabled={!isDirty || !isValid || isPending}
          className="w-full sm:w-auto"
        >
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
};

export default DeliverySettingsForm;