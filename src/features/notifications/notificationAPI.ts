import { apiClient } from "@/app/api-client";
import { PaginatedNotifications } from "./notificationTypes";

export const notificationAPI = apiClient.injectEndpoints({
  endpoints: builder => ({
    getNotifications: builder.query<
      PaginatedNotifications,
      {
        pageIndex?: number;
        pageSize?: number;
      }
    >({
      query: ({
        pageIndex = 1,
        pageSize = 20,
      }) => ({
        url: "/notifications",
        params: {
          pageIndex,
          pageSize,
        },
      }),

      providesTags: ["notifications"],
    }),

    getUnreadCount: builder.query<number, void>({
      query: () => "/notifications/unread-count",

      providesTags: ["notifications"],
    }),

    markNotificationRead: builder.mutation<
      void,
      string
    >({
      query: id => ({
        url: `/notifications/${id}/read`,
        method: "PUT",
      }),

      invalidatesTags: ["notifications"],
    }),

    markAllNotificationsRead: builder.mutation<
      void,
      void
    >({
      query: () => ({
        url: "/notifications/read-all",
        method: "PUT",
      }),

      invalidatesTags: ["notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationAPI;