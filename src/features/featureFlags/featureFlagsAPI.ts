import { apiClient } from "@/app/api-client";
import { ADMIN, CLIENT } from "@/app/api-paths";

export type FeatureTenantValue = {
  tenantId: string;
  tenantName: string;
  /** null = inherits the global value */
  override: boolean | null;
  effective: boolean;
};

export type FeatureFlag = {
  key: string;
  name: string;
  description: string;
  defaultEnabled: boolean;
  /** null = built-in default applies */
  globalOverride: boolean | null;
  globalEffective: boolean;
  tenants: FeatureTenantValue[];
};

/** Feature toggles (feature #13). Admin endpoints are Dev-only. */
export const featureFlagsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /** Effective switches for the current pharmacy (any signed-in user). */
    getFeatures: builder.query<Record<string, boolean>, void>({
      query: () => `${CLIENT}/features`,
      providesTags: ["featureFlags"],
    }),

    getFeatureFlags: builder.query<FeatureFlag[], void>({
      query: () => `${ADMIN}/features`,
      providesTags: ["featureFlags"],
    }),

    setGlobalFeature: builder.mutation<void, { key: string; enabled: boolean | null }>({
      query: ({ key, enabled }) => ({
        url: `${ADMIN}/features/${encodeURIComponent(key)}`,
        method: "PUT",
        body: { enabled },
      }),
      invalidatesTags: ["featureFlags"],
    }),

    setTenantFeature: builder.mutation<
      void,
      { key: string; tenantId: string; enabled: boolean | null }
    >({
      query: ({ key, tenantId, enabled }) => ({
        url: `${ADMIN}/features/${encodeURIComponent(key)}/tenants/${tenantId}`,
        method: "PUT",
        body: { enabled },
      }),
      invalidatesTags: ["featureFlags"],
    }),
  }),
});

export const {
  useGetFeaturesQuery,
  useGetFeatureFlagsQuery,
  useSetGlobalFeatureMutation,
  useSetTenantFeatureMutation,
} = featureFlagsApi;
