export interface Product {
  id: string;
  name: string;
  externalName: string;
  isNameOverridden: boolean;
  categoryId: string;
  categoryName: string;
  thirdPartyId?: string | null;
  description: string;
  imageUrl?: string | null;
  galleryImageUrls?: string[] | null;
  brandId?: string | null;
  brandName?: string | null;
  price: number;
  isPrescription: boolean;
  isDealOfTheDay?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  availableStock: number;
}

export interface GetProductsParams {
  search?: string;
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  onlyInStock?: boolean;
  onlyPrescription?: boolean;
  descending?: boolean;
  pageIndex?: number;
  pageSize?: number;
}

export interface GetProductsResponse {
  products: {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: Product[];
  };
}

/**
 * Mirrors the backend `UpdateProductDto` 1:1.
 * Anything that's `undefined` simply isn't sent / changed.
 */
export interface UpdateProductPayload {
  id: string;
  categoryId: string;
  name?: string;
  description?: string;

  // Brand
  brandId?: string | null;
  brandName?: string | null;
  removeBrand?: boolean;

  // Pricing
  price?: number;

  // Images
  removeMainImage?: boolean;
  removeGalleryImages?: boolean;
  mainImageFile?: File | null;
  galleryImageFiles?: File[];

  // Deal-of-the-day
  isDealOfTheDay?: boolean;
  
  // Best Seller
  isBestSeller?: boolean;

  // New Arrival
  isNewArrival?: boolean;
}

export interface TriggerProductSyncResponse {
  message: string;
  jobId: string;
}