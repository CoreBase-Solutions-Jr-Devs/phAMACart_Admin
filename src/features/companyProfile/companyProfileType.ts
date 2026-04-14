export interface CompanyProfilePhone {
  number: string;
  countryCode: string;
  isPrimary: boolean;
}

export interface CompanyProfileEmail {
  address: string;
  isPrimary: boolean;
}

export interface CompanyProfileAddress {
  street: string;
  city: string;
  county: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  googlePlaceId: string | null;
  isPrimary: boolean;
}

export interface CompanyProfileUser {
  userId: string;
  role: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  logoUrl: string;
  chatLink: string;

  phones: CompanyProfilePhone[];
  emails: CompanyProfileEmail[];
  addresses: CompanyProfileAddress[];
  users: CompanyProfileUser[];
}