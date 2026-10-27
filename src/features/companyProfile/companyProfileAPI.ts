import { apiClient } from "@/app/api-client";
import { ADMIN, CLIENT } from "@/app/api-paths";
import { CompanyProfile } from "./companyProfileType";

export const companyProfileApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /* =========================
       GET COMPANY PROFILE
    ========================= */
    getCompanyProfile: builder.query<CompanyProfile, void>({
      query: () => ({
        url: `${CLIENT}/company-profile`,
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
        pharmacyLicenseNumber?: string | null;

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
        pharmacyLicenseNumber,
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
         * The API reads the whole profile (except files) from the
         * "profile" JSON field. Contact details sent as separate form
         * fields were ignored, and the chat link was cleared on save.
         */
        append(
          "profile",
          JSON.stringify({
            id,
            name,
            chatLink: chatLink || null,
            pharmacyLicenseNumber:
              pharmacyLicenseNumber === undefined ? undefined : pharmacyLicenseNumber ?? "",
            phones: phones ?? [],
            emails: emails ?? [],
            addresses,
          }),
        );

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
          url: `${ADMIN}/company-profile`,
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