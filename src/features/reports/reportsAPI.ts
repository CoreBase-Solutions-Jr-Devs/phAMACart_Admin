import { apiClient } from "@/app/api-client";
import { ADMIN } from "@/app/api-paths";
import type { ReportParams, ReportResult } from "./reportsType";

export const reportsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getReport: builder.query<ReportResult, { id: string; params: ReportParams }>({
      query: ({ id, params }) => ({
        url: `${ADMIN}/reports/${id}`,
        params: {
          from: params.from,
          to: params.to,
          groupBy: params.groupBy,
          threshold: params.threshold,
        },
      }),
      providesTags: (_r, _e, { id }) => [{ type: "reports", id }],
    }),
  }),
});

export const { useGetReportQuery } = reportsApi;
