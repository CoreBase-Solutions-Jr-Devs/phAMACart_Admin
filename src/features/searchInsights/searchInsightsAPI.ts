import { apiClient } from "@/app/api-client";
import { ADMIN } from "@/app/api-paths";
import type { PaginatedResult } from "@/features/users/usersType";

export interface SearchTermCount {
  searchTerm: string;
  count: number;
}

export const searchInsightsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getTopSearches: builder.query<
      { top: number; count: number; data: SearchTermCount[] },
      number
    >({
      query: (top) => ({
        url: `${ADMIN}/analytics/search/top`,
        params: { Top: top },
      }),
      transformResponse: (response: {
        result: { top: number; count: number; data: SearchTermCount[] };
      }) => response.result,
      providesTags: ["searchInsights"],
    }),

    getNoResultSearches: builder.query<
      PaginatedResult<SearchTermCount>,
      { pageIndex: number; pageSize: number }
    >({
      query: ({ pageIndex, pageSize }) => ({
        url: `${ADMIN}/analytics/search/no-results`,
        params: { PageIndex: pageIndex, PageSize: pageSize },
      }),
      transformResponse: (response: { result: PaginatedResult<SearchTermCount> }) =>
        response.result,
      providesTags: ["searchInsights"],
    }),
  }),
});

export const { useGetTopSearchesQuery, useGetNoResultSearchesQuery } =
  searchInsightsApi;
