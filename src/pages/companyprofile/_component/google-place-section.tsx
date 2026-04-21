import { useFormContext } from "react-hook-form";
import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { CompanyProfileFormValues } from "@/features/companyProfile/schema";

interface Props {
  readOnly?: boolean;
}

/**
 * Exactly ONE address, sourced from Google Places API.
 * GooglePlaceId is mandatory when the block is present.
 *
 * NOTE: The actual Google Places autocomplete integration is delegated to the
 * host app's PlacesAutocomplete component — we just show the selected values
 * here and let the caller set them via `setValue("googlePlaceAddress", ...)`.
 */
export const GooglePlaceSection = ({ readOnly }: Props) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CompanyProfileFormValues>();

  const place = watch("googlePlaceAddress");

  const clear = () =>
    setValue("googlePlaceAddress", null, { shouldValidate: true });

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Google Place Address</h3>
          <p className="text-xs text-muted-foreground">
            Exactly one, sourced from the Google Places API.
          </p>
        </div>
        {!readOnly && place && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clear}
          >
            <Trash2Icon className="h-4 w-4 text-destructive" /> Clear
          </Button>
        )}
      </div>

      {!place && (
        <p className="text-sm text-muted-foreground">
          No Google Place selected.
          {!readOnly && " Use the places search above to attach one."}
        </p>
      )}

      {place && (
        <div className="rounded-md border p-3 grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Street</Label>
            <Input
              disabled={readOnly}
              {...register("googlePlaceAddress.street")}
            />
          </div>
          <div>
            <Label className="text-xs">City</Label>
            <Input
              disabled={readOnly}
              {...register("googlePlaceAddress.city")}
            />
          </div>
          <div>
            <Label className="text-xs">Country</Label>
            <Input
              disabled={readOnly}
              {...register("googlePlaceAddress.country")}
            />
          </div>
          <div>
            <Label className="text-xs">Postal code</Label>
            <Input
              disabled={readOnly}
              {...register("googlePlaceAddress.postalCode")}
            />
          </div>
          <div className="col-span-2">
            <Label className="text-xs">Google Place ID *</Label>
            <Input
              disabled={readOnly}
              {...register("googlePlaceAddress.googlePlaceId")}
            />
            {errors.googlePlaceAddress?.googlePlaceId && (
              <p className="text-xs text-destructive">
                {errors.googlePlaceAddress.googlePlaceId.message}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};