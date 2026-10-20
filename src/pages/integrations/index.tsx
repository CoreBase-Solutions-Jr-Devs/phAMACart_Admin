import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Bike, Eye, EyeOff } from "lucide-react";

import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTypedSelector } from "@/app/hook";
import { useSaveGlovoCredentialsMutation } from "@/features/integrations/glovoAPI";
import { parseError } from "@/lib/parse-error";

const schema = z.object({
  name: z.string().max(100).optional(),
  pharmacoreClientId: z
    .number({ invalid_type_error: "phAMACore client id is required" })
    .int()
    .positive("phAMACore client id is required"),
  glovoChainId: z.string().trim().min(1, "Required").max(100),
  glovoVendorId: z.string().trim().min(1, "Required").max(100),
  storeId: z.string().max(100).optional(),
  glovoClientId: z.string().trim().min(1, "Required").max(100),
  glovoClientSecret: z.string().trim().min(1, "Required").max(100),
  glovoBaseUrl: z.string().trim().url("Must be a full URL").or(z.literal("")),
  countryCode: z.string().max(5).optional(),
  externalPartnerConfigId: z.string().max(100).optional(),
  webhookToken: z.string().max(200).optional(),
});

type FormValues = z.infer<typeof schema>;

const Field = ({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={id}>{label}</Label>
    {children}
    {error ? (
      <p className="text-xs text-destructive">{error}</p>
    ) : hint ? (
      <p className="text-xs text-muted-foreground">{hint}</p>
    ) : null}
  </div>
);

const Integrations = () => {
  const tenant = useTypedSelector((state) => state.tenant.currentTenant);
  const [showSecret, setShowSecret] = useState(false);
  const [save, { isLoading }] = useSaveGlovoCredentialsMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      glovoChainId: "",
      glovoVendorId: "",
      storeId: "",
      glovoClientId: "",
      glovoClientSecret: "",
      glovoBaseUrl: "",
      countryCode: "KE",
      externalPartnerConfigId: "",
      webhookToken: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!tenant?.companyProfileId) {
      toast.error("The tenant isn't resolved yet. Reload the page and try again.");
      return;
    }

    const blankToNull = (v?: string) => (v && v.trim() ? v.trim() : null);

    try {
      await save({
        companyProfileId: tenant.companyProfileId,
        pharmacoreClientId: values.pharmacoreClientId,
        glovoChainId: values.glovoChainId,
        glovoVendorId: values.glovoVendorId,
        glovoClientId: values.glovoClientId,
        glovoClientSecret: values.glovoClientSecret,
        glovoBaseUrl: values.glovoBaseUrl,
        countryCode: blankToNull(values.countryCode),
        externalPartnerConfigId: blankToNull(values.externalPartnerConfigId),
        name: blankToNull(values.name),
        storeId: blankToNull(values.storeId),
        webhookToken: blankToNull(values.webhookToken),
      }).unwrap();

      toast.success(`Glovo store ${values.glovoVendorId} connected.`);
      reset();
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  return (
    <PageLayout
      title="Integrations"
      subtitle="Connect delivery partners to this pharmacy."
    >
      <div className="mx-auto mt-4 w-full max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bike className="size-4 text-primary" /> Glovo
            </CardTitle>
            <CardDescription>
              Add the credentials Glovo issued for one of your stores. Each Glovo vendor (store) is
              added once; the client secret is stored encrypted and never shown again. The company
              must be enrolled in the Glovo integration when the tenant is provisioned.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="glovo-name" label="Label" hint="Optional, e.g. 'Westlands branch'">
                  <Input id="glovo-name" {...register("name")} />
                </Field>
                <Field
                  id="glovo-pharmacore"
                  label="phAMACore client id"
                  error={errors.pharmacoreClientId?.message}
                >
                  <Input id="glovo-pharmacore" type="number" min={1} {...register("pharmacoreClientId", { valueAsNumber: true })} />
                </Field>
                <Field id="glovo-chain" label="Chain id" error={errors.glovoChainId?.message}>
                  <Input id="glovo-chain" {...register("glovoChainId")} />
                </Field>
                <Field id="glovo-vendor" label="Vendor (store) id" error={errors.glovoVendorId?.message}>
                  <Input id="glovo-vendor" {...register("glovoVendorId")} />
                </Field>
                <Field id="glovo-store" label="Store id" hint="Optional">
                  <Input id="glovo-store" {...register("storeId")} />
                </Field>
                <Field id="glovo-country" label="Country code" hint="Optional, e.g. KE">
                  <Input id="glovo-country" maxLength={5} {...register("countryCode")} />
                </Field>
              </div>

              <div className="grid gap-4 border-t pt-6 sm:grid-cols-2">
                <Field id="glovo-client" label="Client id" error={errors.glovoClientId?.message}>
                  <Input id="glovo-client" autoComplete="off" {...register("glovoClientId")} />
                </Field>
                <Field id="glovo-secret" label="Client secret" error={errors.glovoClientSecret?.message}>
                  <div className="relative">
                    <Input
                      id="glovo-secret"
                      type={showSecret ? "text" : "password"}
                      autoComplete="new-password"
                      className="pr-10"
                      {...register("glovoClientSecret")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecret((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showSecret ? "Hide secret" : "Show secret"}
                    >
                      {showSecret ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </Field>
                <Field
                  id="glovo-base"
                  label="API base URL"
                  hint="Optional — leave blank for the default"
                  error={errors.glovoBaseUrl?.message}
                >
                  <Input id="glovo-base" placeholder="https://…" {...register("glovoBaseUrl")} />
                </Field>
                <Field id="glovo-partner" label="External partner config id" hint="Optional">
                  <Input id="glovo-partner" {...register("externalPartnerConfigId")} />
                </Field>
                <Field
                  id="glovo-webhook"
                  label="Webhook token"
                  hint="Optional — Glovo sends it with each webhook call"
                >
                  <Input id="glovo-webhook" autoComplete="off" {...register("webhookToken")} />
                </Field>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Connecting…" : "Connect Glovo store"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Integrations;
