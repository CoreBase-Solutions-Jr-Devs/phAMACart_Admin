import { apiClient } from "@/app/api-client";

export interface HealthCheckEntry {
  name: string;
  status: "Healthy" | "Degraded" | "Unhealthy" | string;
  description?: string | null;
  durationMs: number;
  data?: Record<string, unknown>;
}

export interface HealthReport {
  status: "Healthy" | "Degraded" | "Unhealthy" | string;
  durationMs: number;
  checks: HealthCheckEntry[];
}

export const healthApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * /health/details (SuperAdminOnly; not under /v1). The server answers 503
     * when a check is unhealthy, but the body is still the report, so read it
     * for any status.
     */
    getHealthDetails: builder.query<HealthReport, void>({
      query: () => ({
        url: "/health/details",
        validateStatus: (response) =>
          response.status === 200 || response.status === 503,
      }),
      providesTags: ["health"],
    }),
  }),
});

export const { useGetHealthDetailsQuery } = healthApi;
