import { apiClient } from "@/app/api-client";

export interface TenantConfig {
  id: string;
  slug: string;
  displayName: string;
  clientHost: string | null;
  adminHost: string | null;
  thirdPartyBaseUrl: string;
  companyProfileId: string;
}

export interface PaginatedResult<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}

export const tenantApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getTenants: builder.query<PaginatedResult<TenantConfig>, void>({
      query: () => ({
        url: "/tenants",
        params: {
          pageIndex: 0,
          pageSize: 100,
        },
      }),
      providesTags: ["tenants"],
    }),
  }),
});

export const {
  useGetTenantsQuery,
} = tenantApi;