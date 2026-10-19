import { RootState } from "@/app/store";

export const selectNotifications = (
  state: RootState
) => state.notifications.notifications;

export const selectUnreadNotifications = (
  state: RootState
) =>
  state.notifications.notifications.filter(
    x => !x.isRead
  );

export const selectUnreadCount = (
  state: RootState
) =>
  state.notifications.notifications.filter(
    x => !x.isRead
  ).length;