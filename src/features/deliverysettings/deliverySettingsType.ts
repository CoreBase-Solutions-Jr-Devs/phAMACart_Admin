export interface DeliverySettings {
  id: string;
  ratePerKm: number;
  minimumFee: number;
  vatRate: number;
  roundUpDistanceKm: boolean;
  originLatitude: number;
  originLongitude: number;

  hasApiKey: boolean;
  apiKeyLast4?: string | null;

  updatedAt: string;
  updatedBy: string;
}

export interface UpdateDeliverySettingsRequest {
  ratePerKm?: number;
  minimumFee?: number;
  vatRate?: number;
  roundUpDistanceKm?: boolean;
  originLatitude?: number;
  originLongitude?: number;
}

export interface UpdateDeliverySettingsResponse {
  id: string;
}

export interface LocationSuggestionDto {
  placeId: string;
  primaryText: string;
  secondaryText: string;
  fullText: string;
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

export interface ResolvedLocationDto {
  placeId: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  county: string;
  city: string;
  postalCode: string;
  country: string;
}