import { apiClient } from "@/app/api-client";

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
  brandName?: string | null;
  price: number;
  isPrescription: boolean;
}

export interface GetProductsParams {
  search?: string;
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
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

export const productsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<GetProductsResponse, GetProductsParams>({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params,
      }),
      providesTags: ["products"],
    }),

    updateProduct: builder.mutation<
      Product,
      {
        id: string;
        categoryId: string;
        name?: string;
        description?: string;
        brandName?: string;
        price?: number;
        imageUrl?: string | null;
        imageUrls?: string[];
        removeMainImage?: boolean;
        removeAllImages?: boolean;
        imageFiles?: File[]; // ✅ IMPORTANT (plural)
      }
      >({
      query: ({ id, imageFiles, ...rest }) => {
        const formData = new FormData();

        formData.append(
          "product",
          JSON.stringify({
            id,
            ...rest,
          })
        );

        if (imageFiles && imageFiles.length > 0) {
          imageFiles.forEach((file) => {
            formData.append("imageFiles", file);
          });
        }

        return {
          url: "/products",
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["products"],
    }),

    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;