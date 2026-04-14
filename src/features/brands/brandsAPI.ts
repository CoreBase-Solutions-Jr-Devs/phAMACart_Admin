import { apiClient } from "@/app/api-client";
import { Brand } from "./brandsType";

export const brandsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: (params) => ({
        url: "/brands",
        method: "GET",
        params,
      }),
      providesTags: ["brands"],
    }),

    createBrand: builder.mutation<
      Brand,
      {
        id?: string;
        name: string;
        brandImageFile?: File[]; // ✅ IMPORTANT (plural)
      }
    >({
      query: ({ id, name, brandImageFile }) => {
        const formData = new FormData();


        if (id) {
          formData.append("id", id);
        }
        formData.append("name", name);

        // Object.entries(rest).forEach(([key, value]) => {
        //   formData.append(key, value);
        // });

        if (brandImageFile && brandImageFile.length > 0) {
          brandImageFile.forEach((file) => {
            formData.append("brandImageFile", file);
          });
        }

        return {
          url: "/brands",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["brands"],
    }),

    // deleteProduct: builder.mutation<{ success: boolean }, string>({
    //   query: (id) => ({
    //     url: `/products/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["products"],
    // }),
  }),
});

export const {
  useGetBrandsQuery,
  useCreateBrandMutation,
  // useUpdateProductMutation,
  // useDeleteProductMutation,
} = brandsApi;
