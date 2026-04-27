import { apiClient } from "@/app/api-client";
import { CompanyProfile } from "./companyProfileType";

export const companyProfileApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /* =========================
       GET COMPANY PROFILE
    ========================= */
    getCompanyProfile: builder.query<CompanyProfile, void>({
      query: () => ({
        url: "/company-profile",
        method: "GET",
      }),

      // flatten API response
      transformResponse: (response: { companyProfile: CompanyProfile }) =>
        response.companyProfile,

      providesTags: ["company_profile"],
    }),

    /* =========================
       UPDATE COMPANY PROFILE
       (basic form-data example)
    ========================= */
    updateCompanyProfile: builder.mutation<
      CompanyProfile,
      {
        id: string;
        name?: string;
        chatLink?: string;
        logoFile?: File | null;
        pharmacyLicenseFile?: File | null;
      }
    >({
      query: ({ id, name, chatLink, logoFile, pharmacyLicenseFile }) => {
        const formData = new FormData();

        const append = (key: string, value: unknown) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        };

        console.log(logoFile, pharmacyLicenseFile);

        append("profile", JSON.stringify({ id, name }));
        // append("name", name);
        append("chatLink", chatLink);

        if (logoFile) {
          formData.append("logoFile", logoFile);
        }
        if (pharmacyLicenseFile) {
          formData.append("pharmacyLicenseFile", pharmacyLicenseFile);
        }

        return {
          url: "/company-profile",
          method: "PUT",
          body: formData,
        };
      },

      invalidatesTags: ["company_profile"],
    }),
  }),
});

/* =========================
   EXPORT HOOKS
========================= */
export const { useGetCompanyProfileQuery, useUpdateCompanyProfileMutation } =
  companyProfileApi;
