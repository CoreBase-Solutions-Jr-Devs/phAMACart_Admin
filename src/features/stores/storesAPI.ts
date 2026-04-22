import { apiClient } from "@/app/api-client";
import { Stores } from "./storesType";

export const brandsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getStores: builder.query<{ stores: Stores[] }, void>({
      query: () => ({
        url: "/stores",
        method: "GET",
      }),
      providesTags: ["stores"],
    }),

    // createBrand: builder.mutation<
    //   Brand,
    //   {
    //     id?: string;
    //     name: string;
    //     brandImageFile?: File[]; // ✅ IMPORTANT (plural)
    //   }
    // >({
    //   query: ({ id, name, brandImageFile }) => {
    //     const formData = new FormData();

    //     if (id) {
    //       formData.append("id", id);
    //     }
    //     formData.append("name", name);

    //     // Object.entries(rest).forEach(([key, value]) => {
    //     //   formData.append(key, value);
    //     // });

    //     if (brandImageFile && brandImageFile.length > 0) {
    //       brandImageFile.forEach((file) => {
    //         formData.append("brandImageFile", file);
    //       });
    //     }

    //     return {
    //       url: "/brands",
    //       method: "POST",
    //       body: formData,
    //     };
    //   },
    //   invalidatesTags: ["brands"],
    // }),

    updateStore: builder.mutation<
      Stores,
      {
        id: string;
        name?: string;
        phone?: string;
        workingHours?: string;
        latitude?: number;
        longitude?: number;
      }
    >({
      query: ({ id, name, phone, workingHours, latitude, longitude }) => {
        const store = {
          id,
          name,
          phone,
          workingHours,
          latitude,
          longitude,
        };

        return {
          url: "/stores",
          method: "PUT",
          body: { store },
        };
      },
      invalidatesTags: ["stores"],
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
  useGetStoresQuery,
  useUpdateStoreMutation,
  //   useCreateBrandMutation,
  //   useUpdateBrandMutation,
  // useDeleteProductMutation,
} = brandsApi;
