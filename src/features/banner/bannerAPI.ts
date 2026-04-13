import { apiClient } from "@/app/api-client";
import { Banner } from "./bannerType";

export const BannerApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query({
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
        ImageFile?: File[]; // ✅ IMPORTANT (plural)
      }
    >({
      query: ({
        Title,
        SortOrder,
        Type,
        StartDate,
        EndDate,
        ImageFile,
        companyProfileId,
      }) => {
        const formData = new FormData();

        formData.append("Title", Title);
        formData.append("SortOrder", SortOrder);
        formData.append("Type", Type);
        formData.append("StartDate", StartDate);
        formData.append("EndDate", EndDate);
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
        imageUrl: File[];
      }
    >({
      query: ({ id, title, imageUrl, type }) => {
        const formData = new FormData();

        formData.append(
          "banner",
          JSON.stringify({
            id,
            title,
            type,
          }),
        );

        // Object.entries(rest).forEach(([key, value]) => {
        //   formData.append(key, value);
        // });

        if (imageUrl && imageUrl.length > 0) {
          imageUrl.forEach((file) => {
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
