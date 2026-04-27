import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PencilIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import MultiFileUploader, {
  UploadFileItem,
} from "@/components/upload/MultiFileUploader";

import { parseError } from "@/lib/parse-error";

import {
  useGetCompanyProfileQuery,
  useUpdateCompanyProfileMutation,
} from "@/features/companyProfile/companyProfileAPI";

import {
  companyProfileSchema,
  type CompanyProfileFormValues,
} from "@/features/companyProfile/schema";
import type { CompanyProfile } from "@/features/companyProfile/companyProfileType";

import { PhonesSection } from "@/pages/companyprofile/_component/phone-section";
import { EmailsSection } from "@/pages/companyprofile/_component/email-section";
import { AddressesSection } from "@/pages/companyprofile/_component/addresses-section";
import { GooglePlaceSection } from "@/pages/companyprofile/_component/google-place-section";

/* =========================
   CONSTANTS
========================= */
const LOGO_SLOT_ID = "company-logo";
const LICENSE_SLOT_ID = "pharmacy-license";

const LOGO_ACCEPT = "image/png,image/jpeg,image/jpg";
const LICENSE_ACCEPT = "image/png,image/jpeg,image/jpg,application/pdf";

/* =========================
   HELPERS
========================= */
const toDefaultValues = (p?: CompanyProfile): CompanyProfileFormValues => ({
  name: p?.name ?? "",
  logoUrl: p?.logoUrl ?? "",
  chatLink: p?.chatLink ?? "",
  phones: p?.phones ?? [],
  emails: p?.emails ?? [],
  addresses: p?.addresses ?? [],
  googlePlaceAddress: p?.googlePlaceAddress ?? null,
});

const logoFilesFromProfile = (p?: CompanyProfile): UploadFileItem[] =>
  p?.logoUrl
    ? [{ id: LOGO_SLOT_ID, file: null, preview: p.logoUrl }]
    : [];

const licenseFilesFromProfile = (p?: CompanyProfile): UploadFileItem[] =>
  p?.pharmacyLicenseUrl
    ? [{ id: LICENSE_SLOT_ID, file: null, preview: p.pharmacyLicenseUrl }]
    : [];

/* =========================
   COMPONENT
========================= */
export const CompanyProfileForm = () => {
  const [editMode, setEditMode] = useState(false);
  const [logoFiles, setLogoFiles] = useState<UploadFileItem[]>([]);
  const [pharmacyLicenseFiles, setPharmacyLicenseFiles] =
    useState<UploadFileItem[]>([]);

  const { data: profile, isFetching } = useGetCompanyProfileQuery();
  const [updateProfile, { isLoading: isSaving }] =
    useUpdateCompanyProfileMutation();

  const methods = useForm<CompanyProfileFormValues>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: toDefaultValues(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  // Single source of truth for "snap UI back to server state".
  const hydrate = useCallback(
    (p?: CompanyProfile) => {
      reset(toDefaultValues(p));
      setLogoFiles(logoFilesFromProfile(p));
      setPharmacyLicenseFiles(licenseFilesFromProfile(p));
    },
    [reset],
  );

  useEffect(() => {
    hydrate(profile);
  }, [profile, hydrate]);

  const cancel = useCallback(() => {
    hydrate(profile);
    setEditMode(false);
  }, [hydrate, profile]);

  // Each handler closes over exactly one setter — no cross-contamination.
  const handleLogoChange = useCallback(
    (files: UploadFileItem[]) => setLogoFiles(files),
    [],
  );

  const handleLicenseChange = useCallback(
    (files: UploadFileItem[]) => setPharmacyLicenseFiles(files),
    [],
  );

  const onSubmit = useCallback(
    async (data: CompanyProfileFormValues) => {
      if (!profile?.id) {
        toast.error("Profile not loaded yet.");
        return;
      }

      // Server-hydrated preview items have file === null; skip re-sending them.
      const logoFile = logoFiles[0]?.file ?? null;
      const pharmacyLicenseFile = pharmacyLicenseFiles[0]?.file ?? null;

      try {
        await updateProfile({
          id: profile.id,
          name: data.name,
          chatLink: data.chatLink ?? undefined,
          logoFile,
          pharmacyLicenseFile,
        }).unwrap();

        toast.success("Company profile updated.");
        setEditMode(false);
      } catch (err) {
        toast.error(parseError(err));
      }
    },
    [profile?.id, logoFiles, pharmacyLicenseFiles, updateProfile],
  );

  const readOnly = !editMode;

  if (isFetching && !profile) {
    return (
      <div className="py-16 flex items-center justify-center text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 pb-24 relative"
      >
        {/* ===== Header ===== */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {profile?.name ?? "Company profile"}
            </h2>
            {profile?.clientId != null && (
              <p className="text-xs text-muted-foreground">
                Client ID: {profile.clientId}
              </p>
            )}
          </div>

          {!editMode ? (
            <Button type="button" onClick={() => setEditMode(true)}>
              <PencilIcon className="h-4 w-4" /> Edit
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={cancel}
                disabled={isSaving}
              >
                <XIcon className="h-4 w-4" /> Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          )}
        </div>

        {/* ===== Basic info ===== */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold">Basic info</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Name</Label>
              <Input disabled={readOnly} {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label className="text-xs">Chat link</Label>
              <Input
                disabled={readOnly}
                placeholder="https://..."
                {...register("chatLink")}
              />
              {errors.chatLink && (
                <p className="text-xs text-destructive">
                  {errors.chatLink.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Logo</Label>
              <MultiFileUploader
                key={LOGO_SLOT_ID}
                value={logoFiles}
                onChange={handleLogoChange}
                readOnly={readOnly}
                multiple={false}
                accept={LOGO_ACCEPT}
              />
            </div>

            <div>
              <Label className="text-xs">Pharmacy license</Label>
              <MultiFileUploader
                key={LICENSE_SLOT_ID}
                value={pharmacyLicenseFiles}
                onChange={handleLicenseChange}
                readOnly={readOnly}
                multiple={false}
                accept={LICENSE_ACCEPT}
              />
            </div>
          </div>
        </section>

        {/* ===== Contact ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PhonesSection readOnly={readOnly} />
          <EmailsSection readOnly={readOnly} />
        </div>

        {/* ===== Addresses ===== */}
        <AddressesSection readOnly={readOnly} />
        <GooglePlaceSection readOnly={readOnly} />

        {/* ===== Linked users ===== */}
        {profile?.users && profile.users.length > 0 && (
          <section className="space-y-2">
            <h3 className="text-sm font-semibold">Linked users</h3>
            <ul className="text-sm text-muted-foreground list-disc pl-5">
              {profile.users.map((u) => (
                <li key={u.userId}>
                  {u.userId} — <span className="font-medium">{u.role}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </form>
    </FormProvider>
  );
};