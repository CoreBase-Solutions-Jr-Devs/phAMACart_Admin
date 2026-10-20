import { apiClient } from "@/app/api-client";
import { ADMIN, CLIENT } from "@/app/api-paths";
import {
  GetOrdersResponse,
  OrderDetail,
  OrderQueryParams,
} from "./overviewType";

export const overviewApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<
      GetOrdersResponse,
      OrderQueryParams
    >({
      query: (params) => ({
        url: `${ADMIN}/orders`,
        method: "GET",
        params,
      }),
      providesTags: ["orders"],
    }),

    /** Full order (client route; staff may read any order). */
    getOrderById: builder.query<OrderDetail, string>({
      query: (id) => `${CLIENT}/orders/${id}`,
      transformResponse: (response: { order: OrderDetail }) => response.order,
      providesTags: (_r, _e, id) => [{ type: "orders", id }],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
} = overviewApi;