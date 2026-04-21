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

export const PhonesSection = ({ readOnly }: Props) => {
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CompanyProfileFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "phones",
  });

  const phones = watch("phones") ?? [];

  /* Enforce only one primary — when one gets checked, uncheck others */
  const handlePrimaryChange = (index: number, checked: boolean) => {
    if (checked) {
      phones.forEach((_, i) => {
        setValue(`phones.${i}.isPrimary`, i === index, {
          shouldValidate: true,
        });
      });
    } else {
      setValue(`phones.${index}.isPrimary`, false, { shouldValidate: true });
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Phones</h3>
        {!readOnly && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={fields.length >= 2}
            onClick={() =>
              append({ number: "", countryCode: "", isPrimary: fields.length === 0 })
            }
          >
            <PlusIcon className="h-4 w-4" /> Add phone
          </Button>
        )}
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">No phones added.</p>
      )}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-[120px_1fr_auto_auto] gap-2 items-end"
        >
          <div>
            <Label className="text-xs">Country code</Label>
            <Input
              placeholder="+254"
              disabled={readOnly}
              {...register(`phones.${index}.countryCode`)}
            />
          </div>
          <div>
            <Label className="text-xs">Number</Label>
            <Input
              placeholder="712345678"
              disabled={readOnly}
              {...register(`phones.${index}.number`)}
            />
          </div>
          <div className="flex items-center gap-2 pb-2">
            <Checkbox
              checked={phones[index]?.isPrimary ?? false}
              disabled={readOnly}
              onCheckedChange={(c) => handlePrimaryChange(index, Boolean(c))}
            />
            <Label className="text-xs">Primary</Label>
          </div>
          {!readOnly && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
            >
              <Trash2Icon className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      ))}

      {errors.phones?.root && (
        <p className="text-xs text-destructive">{errors.phones.root.message}</p>
      )}
    </section>
  );
};