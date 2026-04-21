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

    getBannerById: builder.query<{ banner: Banner }, string>({
      query: (id) => ({
        url: `/banners/${id}`,
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
        ImageFile?: File[];
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

        sortOrder?: number;
        startDate?: string;
        endDate?: string;

        imageFile: File[] | null;
      }
    >({
      query: ({ id, title, type, sortOrder, startDate, endDate, imageFile }) => {
        console.log("API received sortOrder:", sortOrder);
        const formData = new FormData();

        const append = (key: string, value?: any) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        };

        append("id", id);
        append("title", title);
        append("type", type);
        append("sortOrder", sortOrder !== undefined && !isNaN(sortOrder) ? sortOrder : 0);
        append("startDate", startDate);
        append("endDate", endDate);

        // IMAGE
        if (Array.isArray(imageFile) && imageFile.length > 0) {
          imageFile.forEach((file) => {
            formData.append("imageFile", file);
          });
        }

        return {
          url: `/banners`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["banners"],
    }),

    deleteBanner: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["banners"],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = BannerApi;
