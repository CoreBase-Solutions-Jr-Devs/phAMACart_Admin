import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Building2Icon,
  CheckIcon,
  MailIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

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

/* =========================
   CONSTANTS
========================= */

const LOGO_SLOT_ID = "company-logo";
const LICENSE_SLOT_ID = "pharmacy-license";

const LOGO_ACCEPT = "image/png,image/jpeg,image/jpg";
const LICENSE_ACCEPT =
  "image/png,image/jpeg,image/jpg,application/pdf";

/* =========================
   HELPERS
========================= */

const toDefaultValues = (
  profile?: CompanyProfile,
): CompanyProfileFormValues => ({
  name: profile?.name ?? "",
  logoUrl: profile?.logoUrl ?? "",
  chatLink: profile?.chatLink ?? "",
  pharmacyLicenseNumber: profile?.pharmacyLicenseNumber ?? "",
  phones: profile?.phones ?? [],
  emails: profile?.emails ?? [],
  addresses: profile?.addresses ?? [],
});

const logoFilesFromProfile = (
  profile?: CompanyProfile,
): UploadFileItem[] =>
  profile?.logoUrl
    ? [
      {
        id: LOGO_SLOT_ID,
        file: null,
        preview: profile.logoUrl,
      },
    ]
    : [];

const licenseFilesFromProfile = (
  profile?: CompanyProfile,
): UploadFileItem[] =>
  profile?.pharmacyLicenseUrl
    ? [
      {
        id: LICENSE_SLOT_ID,
        file: null,
        preview: profile.pharmacyLicenseUrl,
      },
    ]
    : [];

/* =========================
   SECTION HEADER
========================= */

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SectionHeader = ({
  icon,
  title,
  description,
}: SectionHeaderProps) => {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        {icon}
      </div>

      <div className="min-w-0">
        <h3 className="text-sm font-semibold">
          {title}
        </h3>

        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};

/* =========================
   COMPONENT
========================= */

export const CompanyProfileForm = () => {
  const [editMode, setEditMode] = useState(false);

  const [logoFiles, setLogoFiles] = useState<
    UploadFileItem[]
  >([]);

  const [
    pharmacyLicenseFiles,
    setPharmacyLicenseFiles,
  ] = useState<UploadFileItem[]>([]);

  const {
    data: profile,
    isFetching,
  } = useGetCompanyProfileQuery();

  const [
    updateProfile,
    { isLoading: isSaving },
  ] = useUpdateCompanyProfileMutation();

  const methods =
    useForm<CompanyProfileFormValues>({
      resolver: zodResolver(
        companyProfileSchema,
      ),
      defaultValues: toDefaultValues(),
    });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  /* =========================
     HYDRATE
  ========================= */

  const hydrate = useCallback(
    (p?: CompanyProfile) => {
      reset(toDefaultValues(p));

      setLogoFiles(
        logoFilesFromProfile(p),
      );

      setPharmacyLicenseFiles(
        licenseFilesFromProfile(p),
      );
    },
    [reset],
  );

  useEffect(() => {
    if (profile) {
      hydrate(profile);
    }
  }, [profile, hydrate]);

  /* =========================
     CANCEL
  ========================= */

  const cancel = useCallback(() => {
    hydrate(profile);
    setEditMode(false);
  }, [hydrate, profile]);

  /* =========================
     FILE HANDLERS
  ========================= */

  const handleLogoChange = useCallback(
    (files: UploadFileItem[]) => {
      setLogoFiles(files);
    },
    [],
  );

  const handleLicenseChange = useCallback(
    (files: UploadFileItem[]) => {
      setPharmacyLicenseFiles(files);
    },
    [],
  );

  /* =========================
     SUBMIT
  ========================= */

  const onSubmit = useCallback(
    async (
      data: CompanyProfileFormValues,
    ) => {
      if (!profile?.id) {
        toast.error(
          "Profile not loaded yet.",
        );
        return;
      }

      const logoFile =
        logoFiles[0]?.file ?? null;

      const pharmacyLicenseFile =
        pharmacyLicenseFiles[0]?.file ?? null;

      // A pharmacy must show its licence: a photo/scan, a number, or both.
      if (
        pharmacyLicenseFiles.length === 0 &&
        !data.pharmacyLicenseNumber?.trim()
      ) {
        toast.error(
          "Add the pharmacy licence: upload a photo or scan, or enter the licence number.",
        );
        return;
      }

      try {
        await updateProfile({
          id: profile.id,

          name: data.name,

          chatLink:
            data.chatLink ?? undefined,

          pharmacyLicenseNumber:
            data.pharmacyLicenseNumber?.trim() ?? "",

          phones: data.phones,

          emails: data.emails,

          addresses: data.addresses,

          logoFile,

          pharmacyLicenseFile,
        }).unwrap();

        toast.success(
          "Company profile updated.",
        );

        setEditMode(false);
      } catch (err) {
        toast.error(parseError(err));
      }
    },
    [
      profile?.id,
      logoFiles,
      pharmacyLicenseFiles,
      updateProfile,
    ],
  );

  const readOnly = !editMode;

  /* =========================
     LOADING
  ========================= */

  if (isFetching && !profile) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="text-sm text-muted-foreground">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-6xl space-y-6 pb-24"
      >
        {/* =========================
            PROFILE HEADER
        ========================= */}

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                {/* Logo */}
                <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                  {profile?.logoUrl ? (
                    <img
                      src={profile.logoUrl}
                      alt={
                        profile.name ??
                        "Company logo"
                      }
                      className="size-full object-cover"
                    />
                  ) : (
                    <Building2Icon className="size-7 text-muted-foreground" />
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-xl font-semibold tracking-tight">
                    {profile?.name ??
                      "Company profile"}
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage your company's public
                    information and contact details.
                  </p>

                  {profile?.clientId != null && (
                    <div className="mt-2 inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                      Client ID:{" "}
                      {profile.clientId}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-2">
                {!editMode ? (
                  <Button
                    type="button"
                    onClick={() =>
                      setEditMode(true)
                    }
                  >
                    <PencilIcon className="size-4" />
                    Edit profile
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancel}
                      disabled={isSaving}
                    >
                      <XIcon className="size-4" />
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      disabled={isSaving}
                    >
                      <CheckIcon className="size-4" />
                      {isSaving
                        ? "Saving..."
                        : "Save changes"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* =========================
            BASIC INFORMATION
        ========================= */}

        <Card>
          <CardHeader>
            <SectionHeader
              icon={
                <Building2Icon className="size-4" />
              }
              title="Basic information"
              description="Your company's name, public chat link and official documents."
            />
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="company-name">
                  Company name
                </Label>

                <Input
                  id="company-name"
                  disabled={readOnly}
                  {...register("name")}
                />

                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Chat link */}
              <div className="space-y-2">
                <Label htmlFor="chat-link">
                  Chat link
                </Label>

                <Input
                  id="chat-link"
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

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Logo */}
              <div className="space-y-2">
                <div>
                  <Label>
                    Company logo
                  </Label>

                  <p className="mt-1 text-xs text-muted-foreground">
                    PNG or JPEG image.
                  </p>
                </div>

                <MultiFileUploader
                  key={LOGO_SLOT_ID}
                  value={logoFiles}
                  onChange={handleLogoChange}
                  readOnly={readOnly}
                  multiple={false}
                  accept={LOGO_ACCEPT}
                />
              </div>

              {/* License */}
              <div className="space-y-2">
                <div>
                  <Label>
                    Pharmacy license
                  </Label>

                  <p className="mt-1 text-xs text-muted-foreground">
                    PNG, JPEG or PDF document.
                  </p>
                </div>

                <MultiFileUploader
                  key={LICENSE_SLOT_ID}
                  value={
                    pharmacyLicenseFiles
                  }
                  onChange={
                    handleLicenseChange
                  }
                  readOnly={readOnly}
                  multiple={false}
                  accept={LICENSE_ACCEPT}
                />

                <div className="space-y-2 pt-2">
                  <Label htmlFor="license-number">
                    Licence number
                  </Label>

                  <Input
                    id="license-number"
                    disabled={readOnly}
                    placeholder="e.g. PPB/R/12345"
                    {...register("pharmacyLicenseNumber")}
                  />

                  <p className="text-xs text-muted-foreground">
                    Required if you don&apos;t upload a licence photo. Shown to customers when there is no photo.
                  </p>

                  {errors.pharmacyLicenseNumber && (
                    <p className="text-xs text-destructive">
                      {errors.pharmacyLicenseNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* =========================
            CONTACT INFORMATION
        ========================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <SectionHeader
                icon={
                  <PhoneIcon className="size-4" />
                }
                title="Phone numbers"
                description="Manage the phone numbers customers can use to reach your company."
              />
            </CardHeader>

            <CardContent>
              <PhonesSection
                readOnly={readOnly}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <SectionHeader
                icon={
                  <MailIcon className="size-4" />
                }
                title="Email addresses"
                description="Manage the email addresses associated with your company."
              />
            </CardHeader>

            <CardContent>
              <EmailsSection
                readOnly={readOnly}
              />
            </CardContent>
          </Card>
        </div>

        {/* =========================
            ADDRESSES
        ========================= */}

        <Card>
          <CardHeader>
            <SectionHeader
              icon={
                <MapPinIcon className="size-4" />
              }
              title="Addresses"
              description="Manage your company's physical and delivery addresses. Addresses can be added manually or resolved using your current Google location."
            />
          </CardHeader>

          <CardContent>
            <AddressesSection
              readOnly={readOnly}
            />
          </CardContent>
        </Card>

        {/* =========================
    LINKED USERS
========================= */}

        {profile?.users &&
          profile.users.length > 0 && (
            <Card>
              <CardHeader>
                <SectionHeader
                  icon={<UsersIcon className="size-4" />}
                  title="Linked users"
                  description="Users currently associated with this company profile."
                />
              </CardHeader>

              <CardContent>
                <div className="overflow-hidden rounded-lg border">
                  {/* Header */}
                  <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1.5fr)] gap-4 border-b bg-muted/40 px-4 py-2.5 text-xs font-medium text-muted-foreground">
                    <span>Name</span>
                    <span>Role</span>
                    <span>User ID</span>
                  </div>

                  {/* Users */}
                  <div className="divide-y">
                    {profile.users.map((user) => (
                      <div
                        key={user.userId}
                        className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1.5fr)] items-center gap-4 px-4 py-3"
                      >
                        {/* Name */}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {user.name || "Unnamed user"}
                          </p>
                        </div>

                        {/* Role */}
                        <div>
                          <span className="inline-flex rounded-md bg-muted px-2 py-1 text-xs font-medium">
                            {user.role || "No role"}
                          </span>
                        </div>

                        {/* ID */}
                        <div className="min-w-0">
                          <p
                            className="truncate font-mono text-xs text-muted-foreground"
                            title={user.userId}
                          >
                            {user.userId}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        {/* =========================
            MOBILE ACTION BAR
        ========================= */}

        {editMode && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-4 py-3 backdrop-blur md:hidden">
            <div className="mx-auto flex max-w-6xl items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={cancel}
                disabled={isSaving}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSaving}
              >
                <CheckIcon className="size-4" />
                {isSaving
                  ? "Saving..."
                  : "Save changes"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </FormProvider>
  );
};