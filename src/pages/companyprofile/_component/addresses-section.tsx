import { useFieldArray, useFormContext } from "react-hook-form";
import { PlusIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import type { CompanyProfileFormValues } from "@/features/companyProfile/schema";

interface Props {
  readOnly?: boolean;
}

export const AddressesSection = ({ readOnly }: Props) => {
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CompanyProfileFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const addresses = watch("addresses") ?? [];

  const handlePrimaryChange = (index: number, checked: boolean) => {
    if (checked) {
      addresses.forEach((_, i) => {
        setValue(`addresses.${i}.isPrimary`, i === index, {
          shouldValidate: true,
        });
      });
    } else {
      setValue(`addresses.${index}.isPrimary`, false, { shouldValidate: true });
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Manual Addresses</h3>
        {!readOnly && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                street: "",
                city: "",
                county: "",
                postalCode: "",
                country: "",
                latitude: null,
                longitude: null,
                googlePlaceId: null,
                isPrimary: fields.length === 0,
              })
            }
          >
            <PlusIcon className="h-4 w-4" /> Add address
          </Button>
        )}
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">No addresses added.</p>
      )}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="rounded-md border p-3 space-y-3 relative"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Street</Label>
              <Input
                disabled={readOnly}
                {...register(`addresses.${index}.street`)}
              />
              {errors.addresses?.[index]?.street && (
                <p className="text-xs text-destructive">
                  {errors.addresses[index]?.street?.message}
                </p>
              )}
            </div>
            <div>
              <Label className="text-xs">City</Label>
              <Input
                disabled={readOnly}
                {...register(`addresses.${index}.city`)}
              />
            </div>
            <div>
              <Label className="text-xs">County</Label>
              <Input
                disabled={readOnly}
                {...register(`addresses.${index}.county`)}
              />
            </div>
            <div>
              <Label className="text-xs">Postal code</Label>
              <Input
                disabled={readOnly}
                {...register(`addresses.${index}.postalCode`)}
              />
            </div>
            <div>
              <Label className="text-xs">Country</Label>
              <Input
                disabled={readOnly}
                {...register(`addresses.${index}.country`)}
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <Checkbox
                checked={addresses[index]?.isPrimary ?? false}
                disabled={readOnly}
                onCheckedChange={(c) => handlePrimaryChange(index, Boolean(c))}
              />
              <Label className="text-xs">Primary</Label>
            </div>
          </div>

          {!readOnly && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => remove(index)}
            >
              <Trash2Icon className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      ))}
    </section>
  );
};