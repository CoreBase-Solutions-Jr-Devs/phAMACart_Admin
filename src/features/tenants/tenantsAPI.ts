import { apiClient } from "@/app/api-client";
import { ADMIN, CLIENT } from "@/app/api-paths";

/** The tenant this admin console belongs to, resolved from its own host name. */
export interface TenantConfig {
  id: string;
  slug: string;
  displayName: string;
  companyProfileId: string;
}

interface ResolveTenantResponse {
  tenantId: string;
  slug: string;
  displayName: string;
  companyProfileId: string;
}

/** Full tenant record, from the Dev/Support-only tenant list. */
export interface TenantListItem {
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
    /**
     * Public lookup: returns only what the console needs to send X-Tenant-Id.
     * Replaces downloading the full tenant list (which is Dev/Support only on /v1).
     */
    resolveTenant: builder.query<TenantConfig, string>({
      query: (host) => ({
        url: `${CLIENT}/tenants/resolve`,
        params: { host },
      }),
      transformResponse: (response: ResolveTenantResponse): TenantConfig => ({
        id: response.tenantId,
        slug: response.slug,
        displayName: response.displayName,
        companyProfileId: response.companyProfileId,
      }),
    }),

    getTenants: builder.query<
      PaginatedResult<TenantListItem>,
      { pageIndex?: number; pageSize?: number } | void
    >({
      query: (params) => ({
        url: `${ADMIN}/tenants`,
        params: {
          pageIndex: params?.pageIndex ?? 0,
          pageSize: params?.pageSize ?? 100,
        },
      }),
      providesTags: ["tenants"],
    }),
  }),
});

export const {
  useResolveTenantQuery,
  useGetTenantsQuery,
} = tenantApi;
