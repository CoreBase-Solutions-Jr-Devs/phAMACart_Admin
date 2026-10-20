import { apiClient } from "@/app/api-client";
import { ADMIN } from "@/app/api-paths";

export interface GlovoCredentialsRequest {
  companyProfileId: string;
  pharmacoreClientId: number;
  glovoChainId: string;
  glovoVendorId: string;
  glovoClientId: string;
  glovoClientSecret: string;
  glovoBaseUrl: string;
  countryCode?: string | null;
  externalPartnerConfigId?: string | null;
  name?: string | null;
  storeId?: string | null;
  webhookToken?: string | null;
}

export const glovoApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /** Adds Glovo credentials for one vendor (store). Create-only: a vendor that already has credentials returns 409. */
    saveGlovoCredentials: builder.mutation<unknown, GlovoCredentialsRequest>({
      query: (body) => ({
        url: `${ADMIN}/integrations/glovo/credentials`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSaveGlovoCredentialsMutation } = glovoApi;
