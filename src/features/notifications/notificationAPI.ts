import { apiClient } from "@/app/api-client";
import { CLIENT } from "@/app/api-paths";
import { PaginatedNotifications } from "./notificationTypes";

/**
 * Staff calling without a userId get the shared back-office feed
 * (orders, prescriptions awaiting review, ...). pageIndex is 0-based.
 */
export const notificationAPI = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      PaginatedNotifications,
      {
        pageIndex?: number;
        pageSize?: number;
      } | void
    >({
      query: (params) => ({
        url: `${CLIENT}/notifications`,
        params: {
          pageIndex: params?.pageIndex ?? 0,
          pageSize: params?.pageSize ?? 20,
        },
      }),

      providesTags: ["notifications"],
    }),

    getUnreadCount: builder.query<number, void>({
      query: () => `${CLIENT}/notifications/unread-count`,
      transformResponse: (response: { count: number }) => response.count,
      providesTags: ["notifications"],
    }),

    markNotificationRead: builder.mutation<void, string>({
      query: (notificationId) => ({
        url: `${CLIENT}/notifications/read`,
        method: "PUT",
        body: { notificationId },
      }),

      invalidatesTags: ["notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationReadMutation,
} = notificationAPI;
