import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useProvisionTenantMutation,
  TENANT_HOST_TYPE_MAP,
} from "@/features/tenantOnboarding/tenantOnboardingAPI";
import { parseError } from "@/lib/parse-error";
import { useProvisionTenantForm } from "@/hooks/use-provision-tenant-form";
import { CompanyInfoSection } from "./company-info-section";
import { ContactSection } from "./contact-section";
import { DomainsSection } from "./domain-section";
import { IntegrationKeysSection } from "./integration-keys-section";
import { LocationSection } from "./location-section";
import { ProvisioningConfigSection } from "./provisioning-config-section";
import { UsersSection } from "./users-section";

export const ProvisionTenantForm = () => {
  const {
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
  } = useProvisionTenantForm();

  const [provisionTenant, { isLoading }] = useProvisionTenantMutation();

  /* ========================= SUBMIT ========================= */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    /* ========================= BASIC VALIDATION ========================= */
    if (!form.companyName.trim()) {
      toast.error("Company name is required.");
      return;
    }
    if (!form.clientId.trim()) {
      toast.error("Client ID is required.");
      return;
    }
    const clientId = Number(form.clientId);
    if (!Number.isInteger(clientId) || clientId <= 0) {
      toast.error("Client ID must be a valid positive number.");
      return;
    }
    if (!form.slug.trim()) {
      toast.error("Tenant slug is required.");
      return;
    }
    if (!form.connectionDb.trim()) {
      toast.error("Connection database is required.");
      return;
    }

    /* ========================= ADDRESS ========================= */
    const address = form.googlePlaceAddress;
    const hasAddress =
      address.street.trim() ||
      address.city.trim() ||
      address.county.trim() ||
      address.postalCode.trim() ||
      address.country.trim() ||
      address.latitude.trim() ||
      address.longitude.trim() ||
      address.googlePlaceId.trim();

    /* ========================= FILES ========================= */
    const logoFile = logoFiles[0]?.file ?? null;
    const pharmacyLicenseFile = pharmacyLicenseFiles[0]?.file ?? null;

    /* ========================= SUBMIT ========================= */
    try {
      const response = await provisionTenant({
        companyName: form.companyName.trim(),
        clientId,
        logoFile,
        pharmacyLicenseFile,
        whatsappChatLink: form.whatsappChatLink.trim() || null,
        googlePlaceAddress: hasAddress
          ? {
              street: address.street.trim(),
              city: address.city.trim(),
              county: address.county.trim(),
              postalCode: address.postalCode.trim(),
              country: address.country.trim(),
              latitude: Number(address.latitude) || 0,
              longitude: Number(address.longitude) || 0,
              googlePlaceId: address.googlePlaceId.trim(),
              isPrimary: true,
            }
          : null,
        domains: form.domains.length
          ? form.domains.map((domain) => ({
              host: domain.host.trim(),
              type: TENANT_HOST_TYPE_MAP[domain.type],
            }))
          : null,
        phones: form.phones.length
          ? form.phones.map((phone) => ({
              number: phone.number.trim(),
              countryCode: phone.countryCode.trim(),
              isPrimary: phone.isPrimary,
            }))
          : null,
        emails: form.emails.length
          ? form.emails.map((email) => ({
              address: email.address.trim(),
              isPrimary: email.isPrimary,
            }))
          : null,
        slug: form.slug.trim(),
        connectionDb: form.connectionDb.trim(),
        thirdPartyBaseUrl: form.thirdPartyBaseUrl.trim(),
        users: form.users.map((user) => ({
          userId: user.userId.trim(),
          role: user.role.trim(),
        })),
        integrationKeys: form.integrationKeys.length
          ? form.integrationKeys.map((integration) => ({
              key: integration.key.trim(),
              value: integration.value,
            }))
          : null,
      }).unwrap();

      toast.success(
        response.isComplete
          ? "Tenant provisioned successfully."
          : "Tenant provisioning started.",
      );

      resetForm();
    } catch (error) {
      toast.error(parseError(error));
    }
  };

  /* ========================= RENDER ========================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-6xl space-y-6 pb-24"
    >
      <CompanyInfoSection
        companyName={form.companyName}
        clientId={form.clientId}
        whatsappChatLink={form.whatsappChatLink}
        onCompanyNameChange={(value) => update("companyName", value)}
        onClientIdChange={(value) => update("clientId", value)}
        onWhatsappChatLinkChange={(value) =>
          update("whatsappChatLink", value)
        }
        logoFiles={logoFiles}
        pharmacyLicenseFiles={pharmacyLicenseFiles}
        onLogoChange={setLogoFiles}
        onLicenseChange={setPharmacyLicenseFiles}
      />

      <DomainsSection
        domains={form.domains}
        onAdd={addDomain}
        onRemove={removeDomain}
        onUpdate={updateDomain}
      />

      <ContactSection
        phones={form.phones}
        emails={form.emails}
        onAddPhone={addPhone}
        onRemovePhone={removePhone}
        onUpdatePhone={updatePhone}
        onSetPrimaryPhone={setPrimaryPhone}
        onAddEmail={addEmail}
        onRemoveEmail={removeEmail}
        onUpdateEmail={updateEmail}
        onSetPrimaryEmail={setPrimaryEmail}
      />

      <LocationSection
        address={form.googlePlaceAddress}
        onUpdateField={updateAddressField}
        onResolvedAddress={setResolvedAddress}
      />

      <ProvisioningConfigSection
        slug={form.slug}
        connectionDb={form.connectionDb}
        thirdPartyBaseUrl={form.thirdPartyBaseUrl}
        onSlugChange={(value) => update("slug", value)}
        onConnectionDbChange={(value) => update("connectionDb", value)}
        onThirdPartyBaseUrlChange={(value) =>
          update("thirdPartyBaseUrl", value)
        }
      />

      <UsersSection
        users={form.users}
        onAdd={addUser}
        onRemove={removeUser}
        onUpdate={updateUser}
      />

      <IntegrationKeysSection
        integrationKeys={form.integrationKeys}
        onAdd={addIntegration}
        onRemove={removeIntegration}
        onUpdate={updateIntegration}
      />

      <div className="sticky bottom-4 z-20 flex justify-end">
        <div className="rounded-xl border bg-background/95 p-2 shadow-lg backdrop-blur">
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading && <Loader2 className="size-4 animate-spin" />}
            {isLoading ? "Provisioning tenant..." : "Provision tenant"}
          </Button>
        </div>
      </div>
    </form>
  );
};