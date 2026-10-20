import { apiClient } from "@/app/api-client";
import { ADMIN, CLIENT } from "@/app/api-paths";
import { Product, GetProductsResponse, GetProductsParams, TriggerProductSyncResponse, UpdateProductPayload } from "./productsType";

export const productsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<GetProductsResponse, GetProductsParams>({
      query: (params) => ({
        url: `${CLIENT}/products`,
        method: "GET",
        params,
      }),
      providesTags: ["products"],
    }),

    triggerProductSync: builder.mutation<TriggerProductSyncResponse, void>({
      query: () => ({
        url: `${ADMIN}/products-sync/immediate`,
        method: "POST",
      }),
      invalidatesTags: ["products"],
    }),

    /** Moves the selected products into one leaf category. */
    bulkAssignCategory: builder.mutation<
      { requestedCount: number; updatedCount: number; missingProductIds: string[] },
      { productIds: string[]; categoryId: string }
    >({
      query: (body) => ({
        url: `${ADMIN}/products/category`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["products"],
    }),

    /** Fills product descriptions from an Excel file (multipart field "file"). */
    importProductData: builder.mutation<
      { totalRows: number; updated: number; notFound: number; alreadyHadDescription: number },
      File
    >({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: `${ADMIN}/products/import-data`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["products"],
    }),

    updateProduct: builder.mutation<Product, UpdateProductPayload>({
      query: ({ mainImageFile, galleryImageFiles, ...rest }) => {
        const formData = new FormData();

        // Backend expects a `product` part containing the JSON DTO
        formData.append("product", JSON.stringify(rest));

        // Single main image (backend: IFormFile? MainImageFile)
        if (mainImageFile) {
          formData.append("mainImageFile", mainImageFile);
        }

        // Gallery images (backend: List<IFormFile>? GalleryImageFiles)
        if (galleryImageFiles && galleryImageFiles.length > 0) {
          galleryImageFiles.forEach((file) => {
            formData.append("galleryImageFiles", file);
          });
        }

        return {
          url: `${ADMIN}/products`,
          method: "PUT",
          body: formData,
        };
      },
      transformErrorResponse: (response: any) => {
        const data = response?.data;

        // Domain-specific handling
        if (data?.title === "CategoryNotLeafException") {
          return {
            message: "Please select a valid sub-category (last level).",
            code: "CATEGORY_NOT_LEAF",
          };
        }

        if (data?.title === "ProductAlreadyExistsException") {
          return {
            message: "A product with this name already exists.",
            code: "PRODUCT_ALREADY_EXISTS",
          };
        }

        if (data?.title === "CategoryNotFoundException") {
          return {
            message: "Selected category was not found.",
            code: "CATEGORY_NOT_FOUND",
          };
        }

        // FluentValidation / model-state errors
        if (data?.errors) {
          const messages = Object.values(data.errors).flat();
          return {
            message: messages.join(", "),
            code: "VALIDATION_ERROR",
          };
        }

        // Generic fallback
        return {
          message:
            data?.detail ||
            data?.title ||
            "Something went wrong. Please try again.",
          code: "UNKNOWN",
        };
      },
      invalidatesTags: ["products"],
    }),

    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `${ADMIN}/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useTriggerProductSyncMutation,
  useBulkAssignCategoryMutation,
  useImportProductDataMutation, 
} = productsApi;