import { apiClient } from "@/app/api-client";
import { Banner } from "./bannerType";

export const BannerApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query<{ banners: Banner[] }, void>({
      query: () => ({
        url: "/banners",
        method: "GET",
      }),
      providesTags: ["banners"],
    }),

    createBanner: builder.mutation<
      Banner,
      {
        Title: string;
        SortOrder: number;
        Type: number;
        StartDate: Date;
        EndDate: Date;
        companyProfileId: string;
        // isTitleDisplayed: string;
        ImageFile?: File[]; // ✅ IMPORTANT (plural)
      }
    >({
      query: ({
        Title,
        SortOrder,
        Type,
        StartDate,
        EndDate,
        // isTitleDisplayed,
        ImageFile,
        companyProfileId,
      }) => {
        const formData = new FormData();

        formData.append("Title", Title);
        formData.append("SortOrder", SortOrder.toString());
        formData.append("Type", Type.toString());
        formData.append("StartDate", StartDate.toISOString());
        // formData.append("isTitleDisplayed", isTitleDisplayed);
        formData.append("EndDate", EndDate.toISOString());
        formData.append("companyProfileId", companyProfileId);

        // Object.entries(rest).forEach(([key, value]) => {
        //   formData.append(key, value);
        // });

        if (ImageFile && ImageFile.length > 0) {
          ImageFile.forEach((file) => {
            formData.append("ImageFile", file);
          });
        }

        return {
          url: "/banners",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["banners"],
    }),

    updateBanner: builder.mutation<
      Banner,
      {
        id: string;
        title: string;
        type: string;
        imageFile: File[] | null;
      }
    >({
      query: ({ id, title, imageFile, type }) => {
        const formData = new FormData();

        formData.append("id", id);
        formData.append("title", title);
        formData.append("type", type);

        // Object.entries(rest).forEach(([key, value]) => {
        //   formData.append(key, value);
        // });

        if (Array.isArray(imageFile) && imageFile.length > 0) {
        imageFile.forEach((file) => {
          formData.append("imageFile", file);
        });
}
        return {
          url: "/banners",
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["banners"],
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
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  // useCreateBrandMutation,
  // useUpdateProductMutation,
  // useDeleteProductMutation,
} = BannerApi;
