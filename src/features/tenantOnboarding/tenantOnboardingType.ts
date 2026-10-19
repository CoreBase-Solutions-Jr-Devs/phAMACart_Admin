import type { TenantHostTypeLabel } from "@/features/tenantOnboarding/tenantOnboardingAPI";

/* ========================= TYPES ========================= */

export interface DomainInput {
  host: string;
  type: TenantHostTypeLabel;
}

export interface PhoneEntry {
  number: string;
  countryCode: string;
  isPrimary: boolean;
}

export interface EmailEntry {
  address: string;
  isPrimary: boolean;
}

export interface GooglePlaceAddressInput {
  street: string;
  city: string;
  county: string;
  postalCode: string;
  country: string;
  latitude: string;
  longitude: string;
  googlePlaceId: string;
}

export interface CompanyProfileUser {
  userId: string;
  role: string;
}

export interface CompanyProfileIntegration {
  key: string;
  value: string;
}

export interface ProvisionFormState {
  companyName: string;
  clientId: string;
  whatsappChatLink: string;
  googlePlaceAddress: GooglePlaceAddressInput;
  slug: string;
  connectionDb: string;
  thirdPartyBaseUrl: string;
  domains: DomainInput[];
  phones: PhoneEntry[];
  emails: EmailEntry[];
  users: CompanyProfileUser[];
  integrationKeys: CompanyProfileIntegration[];
}

/* ========================= INITIAL STATE ========================= */

export const initialGooglePlaceAddress: GooglePlaceAddressInput = {
  street: "",
  city: "",
  county: "",
  postalCode: "",
  country: "",
  latitude: "",
  longitude: "",
  googlePlaceId: "",
};

export const initialProvisionFormState: ProvisionFormState = {
  companyName: "",
  clientId: "",
  whatsappChatLink: "",
  googlePlaceAddress: initialGooglePlaceAddress,
  slug: "",
  connectionDb: "",
  thirdPartyBaseUrl: "",
  domains: [],
  phones: [],
  emails: [],
  users: [],
  integrationKeys: [],
};