import { useState } from "react";
import type { UploadFileItem } from "@/components/upload/MultiFileUploader";
import { PhoneEntry, CompanyProfileUser } from "@/features/companyProfile/companyProfileType";
import { GooglePlaceAddressInput } from "@/features/deliverysettings/deliverySettingsType";
import { ProvisionFormState, initialProvisionFormState, DomainInput, CompanyProfileIntegration } from "@/features/tenantOnboarding/tenantOnboardingType";

/**
 * Owns all state for the provision-tenant form: the field values plus
 * every add/remove/update handler for the repeatable sections (domains,
 * phones, emails, users, integration keys). Section components stay
 * presentational and just call back into this hook.
 */
export function useProvisionTenantForm() {
  const [form, setForm] = useState<ProvisionFormState>(
    initialProvisionFormState,
  );
  const [logoFiles, setLogoFiles] = useState<UploadFileItem[]>([]);
  const [pharmacyLicenseFiles, setPharmacyLicenseFiles] = useState<
    UploadFileItem[]
  >([]);

  /* ========================= GENERIC UPDATE ========================= */

  const update = <K extends keyof ProvisionFormState>(
    key: K,
    value: ProvisionFormState[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialProvisionFormState);
    setLogoFiles([]);
    setPharmacyLicenseFiles([]);
  };

  /* ========================= DOMAINS ========================= */

  const addDomain = () => {
    update("domains", [...form.domains, { host: "", type: "Client" }]);
  };

  const removeDomain = (index: number) => {
    update(
      "domains",
      form.domains.filter((_, i) => i !== index),
    );
  };

  const updateDomain = (
    index: number,
    key: keyof DomainInput,
    value: string,
  ) => {
    const domains = [...form.domains];
    domains[index] = { ...domains[index], [key]: value } as DomainInput;
    update("domains", domains);
  };

  /* ========================= PHONES ========================= */

  const addPhone = () => {
    update("phones", [
      ...form.phones,
      { number: "", countryCode: "KE", isPrimary: form.phones.length === 0 },
    ]);
  };

  const removePhone = (index: number) => {
    const remaining = form.phones.filter((_, i) => i !== index);
    // If the primary phone was removed, make the first remaining phone primary.
    if (form.phones[index]?.isPrimary && remaining.length > 0) {
      remaining[0] = { ...remaining[0], isPrimary: true };
    }
    update("phones", remaining);
  };

  const updatePhone = (
    index: number,
    key: keyof PhoneEntry,
    value: string,
  ) => {
    const phones = [...form.phones];
    phones[index] = { ...phones[index], [key]: value } as PhoneEntry;
    update("phones", phones);
  };

  const setPrimaryPhone = (index: number) => {
    update(
      "phones",
      form.phones.map((phone, i) => ({ ...phone, isPrimary: i === index })),
    );
  };

  /* ========================= EMAILS ========================= */

  const addEmail = () => {
    update("emails", [
      ...form.emails,
      { address: "", isPrimary: form.emails.length === 0 },
    ]);
  };

  const removeEmail = (index: number) => {
    const remaining = form.emails.filter((_, i) => i !== index);
    // If the primary email was removed, make the first remaining email primary.
    if (form.emails[index]?.isPrimary && remaining.length > 0) {
      remaining[0] = { ...remaining[0], isPrimary: true };
    }
    update("emails", remaining);
  };

  const updateEmail = (index: number, value: string) => {
    const emails = [...form.emails];
    emails[index] = { ...emails[index], address: value };
    update("emails", emails);
  };

  const setPrimaryEmail = (index: number) => {
    update(
      "emails",
      form.emails.map((email, i) => ({ ...email, isPrimary: i === index })),
    );
  };

  /* ========================= USERS ========================= */

  const addUser = () => {
    update("users", [...form.users, { userId: "", role: "" }]);
  };

  const removeUser = (index: number) => {
    update(
      "users",
      form.users.filter((_, i) => i !== index),
    );
  };

  const updateUser = (
    index: number,
    key: keyof CompanyProfileUser,
    value: string,
  ) => {
    const users = [...form.users];
    users[index] = { ...users[index], [key]: value };
    update("users", users);
  };

  /* ========================= INTEGRATIONS ========================= */

  const addIntegration = () => {
    update("integrationKeys", [
      ...form.integrationKeys,
      { key: "", value: "" },
    ]);
  };

  const removeIntegration = (index: number) => {
    update(
      "integrationKeys",
      form.integrationKeys.filter((_, i) => i !== index),
    );
  };

  const updateIntegration = (
    index: number,
    key: keyof CompanyProfileIntegration,
    value: string,
  ) => {
    const integrations = [...form.integrationKeys];
    integrations[index] = { ...integrations[index], [key]: value };
    update("integrationKeys", integrations);
  };

  /* ========================= GOOGLE PLACE ADDRESS ========================= */

  const updateAddressField = (
    key: keyof GooglePlaceAddressInput,
    value: string,
  ) => {
    update("googlePlaceAddress", { ...form.googlePlaceAddress, [key]: value });
  };

  // Bulk-set the whole address at once, e.g. after the Google Places
  // resolver returns a fully-resolved place.
  const setResolvedAddress = (address: GooglePlaceAddressInput) => {
    update("googlePlaceAddress", address);
  };

  return {
    form,
    logoFiles,
    pharmacyLicenseFiles,
    setLogoFiles,
    setPharmacyLicenseFiles,
    update,
    resetForm,
    addDomain,
    removeDomain,
    updateDomain,
    addPhone,
    removePhone,
    updatePhone,
    setPrimaryPhone,
    addEmail,
    removeEmail,
    updateEmail,
    setPrimaryEmail,
    addUser,
    removeUser,
    updateUser,
    addIntegration,
    removeIntegration,
    updateIntegration,
    updateAddressField,
    setResolvedAddress,
  };
}

export type UseProvisionTenantFormReturn = ReturnType<
  typeof useProvisionTenantForm
>;