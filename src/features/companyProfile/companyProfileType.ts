export interface PhoneEntry {
  number: string;
  countryCode: string;
  isPrimary: boolean;
}

export interface EmailEntry {
  address: string;
  isPrimary: boolean;
}

export interface Address {
  street: string;
  city: string;
  county?: string | null;
  postalCode?: string | null;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  googlePlaceId?: string | null;
  isPrimary: boolean;
}

export interface CompanyProfileUser {
  userId: string;
  role: "Admin" | "SuperAdmin";
}

export interface CompanyProfile {
  id: string;
  name: string;
  clientId: number;
  logoUrl?: string | null;
  pharmacyLicenseUrl?: string | null;
  chatLink?: string | null;
  phones: PhoneEntry[];
  emails: EmailEntry[];
  addresses: Address[];
  googlePlaceAddress?: Address | null;
  users?: CompanyProfileUser[];
}

export type UpdateCompanyProfilePayload = Omit<
  CompanyProfile,
  "id" | "clientId"
>;
