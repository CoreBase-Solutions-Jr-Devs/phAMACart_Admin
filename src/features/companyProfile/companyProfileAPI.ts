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

      transformResponse: (response: {
        companyProfile: CompanyProfile;
      }) => response.companyProfile,

      providesTags: ["company_profile"],
    }),

    /* =========================
       UPDATE COMPANY PROFILE
       multipart/form-data
    ========================= */
    updateCompanyProfile: builder.mutation<
      CompanyProfile,
      {
        id: string;
        name?: string;
        chatLink?: string;

        phones?: CompanyProfile["phones"];
        emails?: CompanyProfile["emails"];
        addresses?: CompanyProfile["addresses"];

        logoFile?: File | null;
        pharmacyLicenseFile?: File | null;
      }
    >({
      query: ({
        id,
        name,
        chatLink,
        phones,
        emails,
        addresses,
        logoFile,
        pharmacyLicenseFile,
      }) => {
        const formData = new FormData();

        const append = (
          key: string,
          value: unknown,
        ) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        };

        /*
         * Basic profile information.
         *
         * Keep this as JSON because the existing backend
         * endpoint already expects the profile object here.
         */
        append(
          "profile",
          JSON.stringify({
            id,
            name,
          }),
        );

        append("chatLink", chatLink);

        /*
         * Contact information
         */
        if (phones !== undefined) {
          formData.append(
            "phones",
            JSON.stringify(phones),
          );
        }

        if (emails !== undefined) {
          formData.append(
            "emails",
            JSON.stringify(emails),
          );
        }

        /*
         * Company addresses
         *
         * This now contains both manually entered addresses
         * and addresses resolved from the current location.
         */
        if (addresses !== undefined) {
          formData.append(
            "addresses",
            JSON.stringify(addresses),
          );
        }

        /*
         * Files
         */
        if (logoFile) {
          formData.append("logoFile", logoFile);
        }

        if (pharmacyLicenseFile) {
          formData.append(
            "pharmacyLicenseFile",
            pharmacyLicenseFile,
          );
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
export const {
  useGetCompanyProfileQuery,
  useUpdateCompanyProfileMutation,
} = companyProfileApi;