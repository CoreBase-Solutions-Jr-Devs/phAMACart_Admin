import { apiClient } from "@/app/api-client";
import {
  GetOrdersResponse,
  OrderQueryParams,
} from "./overviewType";

export const overviewApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<
      GetOrdersResponse,
      OrderQueryParams
    >({
      query: (params) => ({
        url: "/orders",
        method: "GET",
        params,
      }),
      providesTags: ["orders"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
} = overviewApi;