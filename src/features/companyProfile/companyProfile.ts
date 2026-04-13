import { apiClient } from "@/app/api-client";

export const companyProfileApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getCompanyProfile: builder.query({
      query: () => ({
        url: "/company-profile",
        method: "GET",
      }),
      providesTags: ["company_profile"],
    }),
  }),
});

export const { useGetCompanyProfileQuery } = companyProfileApi;
