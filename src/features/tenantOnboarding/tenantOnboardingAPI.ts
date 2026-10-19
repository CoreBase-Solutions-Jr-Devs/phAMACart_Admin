import { apiClient } from "@/app/api-client";

export type TenantHostTypeLabel =
  | "Client"
  | "Backend"
  | "Admin";

export const TENANT_HOST_TYPE_MAP: Record<
  TenantHostTypeLabel,
  number
> = {
  Client: 1,
  Backend: 2,
  Admin: 3,
};

/* ========================= TYPES ========================= */

export interface TenantDomainInput {
  host: string;
  type: number;
}

export interface PhoneEntryDto {
  number: string;
  countryCode: string;
  isPrimary: boolean;
}

export interface EmailEntryDto {
  address: string;
  isPrimary: boolean;
}

export interface GooglePlaceAddressDto {
  street: string;
  city: string;
  county: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  googlePlaceId: string;
  isPrimary: boolean;
}

export interface CompanyProfileUserDto {
  userId: string;
  role: string;
}

export interface CompanyProfileIntegrationDto {
  key: string;
  value: string;
}

/* =========================================================
 * PROVISION REQUEST
 * ========================================================= */

export interface ProvisionTenantRequest {
  companyName: string;
  clientId: number;

  logoFile?: File | null;
  pharmacyLicenseFile?: File | null;

  whatsappChatLink?: string | null;

  googlePlaceAddress?: GooglePlaceAddressDto | null;

  domains: TenantDomainInput[] | null;

  phones?: PhoneEntryDto[] | null;

  emails?: EmailEntryDto[] | null;

  slug: string;

  connectionDb: string;

  thirdPartyBaseUrl: string;

  users: CompanyProfileUserDto[];

  integrationKeys?:
    | CompanyProfileIntegrationDto[]
    | null;
}

export interface ProvisionTenantResponse {
  provisioningStateId: string;
  tenantId?: string | null;
  databaseName?: string | null;
  companyProfileId?: string | null;
  currentStep: string;
  isComplete: boolean;
}

/* =========================================================
 * FORM DATA
 * ========================================================= */

const buildProvisionTenantFormData = (
  request: ProvisionTenantRequest,
): FormData => {
  const formData = new FormData();

  /* ========================= BASIC ========================= */

  formData.append(
    "companyName",
    request.companyName,
  );

  formData.append(
    "clientId",
    String(request.clientId),
  );

  formData.append(
    "slug",
    request.slug,
  );

  formData.append(
    "connectionDb",
    request.connectionDb,
  );

  formData.append(
    "thirdPartyBaseUrl",
    request.thirdPartyBaseUrl,
  );

  /* ========================= FILES ========================= */

  if (request.logoFile) {
    formData.append(
      "logoFile",
      request.logoFile,
    );
  }

  if (request.pharmacyLicenseFile) {
    formData.append(
      "pharmacyLicenseFile",
      request.pharmacyLicenseFile,
    );
  }

  /* ========================= OPTIONAL VALUES ========================= */

  if (
    request.whatsappChatLink
  ) {
    formData.append(
      "whatsappChatLink",
      request.whatsappChatLink,
    );
  }

  /* ========================= ADDRESS ========================= */

  if (request.googlePlaceAddress) {
    formData.append(
      "googlePlaceAddress",
      JSON.stringify(
        request.googlePlaceAddress,
      ),
    );
  }

  /* ========================= DOMAINS ========================= */

  if (request.domains) {
    formData.append(
      "domains",
      JSON.stringify(request.domains),
    );
  }

  /* ========================= PHONES ========================= */

  if (request.phones) {
    formData.append(
      "phones",
      JSON.stringify(request.phones),
    );
  }

  /* ========================= EMAILS ========================= */

  if (request.emails) {
    formData.append(
      "emails",
      JSON.stringify(request.emails),
    );
  }

  /* ========================= USERS ========================= */

  formData.append(
    "users",
    JSON.stringify(request.users),
  );

  /* ========================= INTEGRATIONS ========================= */

  if (request.integrationKeys) {
    formData.append(
      "integrationKeys",
      JSON.stringify(
        request.integrationKeys,
      ),
    );
  }

  return formData;
};

/* =========================================================
 * API
 * ========================================================= */

export const tenantProvisionAPI =
  apiClient.injectEndpoints({
    endpoints: (builder) => ({
      provisionTenant:
        builder.mutation<
          ProvisionTenantResponse,
          ProvisionTenantRequest
        >({
          query: (request) => ({
            url: "/tenants/provision",
            method: "POST",
            body:
              buildProvisionTenantFormData(
                request,
              ),
          }),
        }),
    }),
  });

export const {
  useProvisionTenantMutation,
} = tenantProvisionAPI;