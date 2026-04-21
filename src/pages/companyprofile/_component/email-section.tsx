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

export const EmailsSection = ({ readOnly }: Props) => {
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CompanyProfileFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "emails",
  });

  const emails = watch("emails") ?? [];

  const handlePrimaryChange = (index: number, checked: boolean) => {
    if (checked) {
      emails.forEach((_, i) => {
        setValue(`emails.${i}.isPrimary`, i === index, {
          shouldValidate: true,
        });
      });
    } else {
      setValue(`emails.${index}.isPrimary`, false, { shouldValidate: true });
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Emails</h3>
        {!readOnly && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={fields.length >= 2}
            onClick={() =>
              append({ address: "", isPrimary: fields.length === 0 })
            }
          >
            <PlusIcon className="h-4 w-4" /> Add email
          </Button>
        )}
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">No emails added.</p>
      )}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-[1fr_auto_auto] gap-2 items-end"
        >
          <div>
            <Label className="text-xs">Email address</Label>
            <Input
              type="email"
              placeholder="hello@company.com"
              disabled={readOnly}
              {...register(`emails.${index}.address`)}
            />
            {errors.emails?.[index]?.address && (
              <p className="text-xs text-destructive">
                {errors.emails[index]?.address?.message}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 pb-2">
            <Checkbox
              checked={emails[index]?.isPrimary ?? false}
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
    </section>
  );
};