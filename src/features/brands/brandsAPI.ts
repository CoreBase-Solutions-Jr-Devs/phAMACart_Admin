import { apiClient } from "@/app/api-client";
import { ADMIN, CLIENT } from "@/app/api-paths";
import { Brand } from "./brandsType";

/* =========================
   TYPES
========================= */

export interface GetBrandsParams {
  search?: string;
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  descending?: boolean;
}

export interface GetBrandsResponse {
  brands: {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: Brand[];
  };
}

export interface CreateBrandPayload {
  name: string;
  description: string;
  brandImageFile: File;
}

export interface CreateBrandResult {
  id: string;
}

export interface UpdateBrandPayload {
  id: string;
  name: string;
  description?: string | null;  
  brandImageUrl?: string | null;
  brandImageFile?: File | null;
}

export interface UpdateBrandResult {
  brand: Brand;
}

/* =========================
   API
========================= */

export const brandsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /* =========================
       GET
    ========================= */
    getBrands: builder.query<GetBrandsResponse, GetBrandsParams>({
      query: (params) => ({
        url: `${CLIENT}/brands`,
        method: "GET",
        params,
      }),

      providesTags: ["brands"],
    }),

    /* =========================
       CREATE
    ========================= */
    createBrand: builder.mutation<
      CreateBrandResult,
      CreateBrandPayload
    >({
      query: ({ name, description, brandImageFile }) => {
        const formData = new FormData();

        formData.append("name", name);
        formData.append("description", description);
        formData.append("brandImageFile", brandImageFile);

        return {
          url: `${ADMIN}/brands`,
          method: "POST",
          body: formData,
        };
      },

      transformErrorResponse: brandErrorMapper,

      invalidatesTags: ["brands"],
    }),

    /* =========================
       UPDATE
    ========================= */
    updateBrand: builder.mutation<
      UpdateBrandResult,
      UpdateBrandPayload
    >({
      query: ({
        id,
        name,
        description,
        brandImageUrl,
        brandImageFile,
      }) => {
        const formData = new FormData();

        formData.append(
          "Brand",
          JSON.stringify({
            Id: id,
            Name: name,
            Description: description ?? null,
            BrandImageUrl: brandImageUrl ?? null,
          }),
        );

        if (brandImageFile) {
          formData.append("BrandImageFile", brandImageFile);
        }

        return {
          url: `${ADMIN}/brands`,
          method: "PUT",
          body: formData,
        };
      },

      transformErrorResponse: brandErrorMapper,

      invalidatesTags: ["brands"],
    }),

  }),
});

/* =========================
   ERROR MAPPER
========================= */

function brandErrorMapper(response: any) {
  const data = response?.data;

  if (data?.title === "BrandNameExistsException") {
    return {
      message: "A brand with this name already exists.",
      code: "BRAND_NAME_EXISTS",
    };
  }

  if (data?.title === "BrandSlugExistsException") {
    return {
      message: "A similar brand already exists.",
      code: "BRAND_SLUG_EXISTS",
    };
  }

  if (data?.title === "BrandNotFoundException") {
    return {
      message: "Brand not found.",
      code: "BRAND_NOT_FOUND",
    };
  }

  if (data?.errors) {
    const messages = Object.values(data.errors).flat();

    return {
      message: messages.join(", "),
      code: "VALIDATION_ERROR",
    };
  }

  return {
    message:
      data?.detail ||
      data?.title ||
      "Something went wrong.",

    code: "UNKNOWN",
  };
}

/* =========================
   HOOKS
========================= */

export const {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
} = brandsApi;