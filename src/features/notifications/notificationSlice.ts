import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationDto } from "./notificationTypes";

interface NotificationState {
  notifications: NotificationDto[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    notificationsLoaded(
      state,
      action: PayloadAction<NotificationDto[]>
    ) {
      // Merge: keep live (SignalR) notifications that arrived before the
      // history page loaded, newest first, no duplicates.
      const loadedIds = new Set(action.payload.map(x => x.id));
      const liveOnly = state.notifications.filter(x => !loadedIds.has(x.id));

      state.notifications = [...liveOnly, ...action.payload].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },

    notificationReceived(
      state,
      action: PayloadAction<NotificationDto>
    ) {
      if (state.notifications.some(x => x.id === action.payload.id)) {
        return;
      }

      state.notifications.unshift(action.payload);
    },

    markAsRead(
      state,
      action: PayloadAction<string>
    ) {
      const notification = state.notifications.find(
        x => x.id === action.payload
      );

      if (notification) {
        notification.isRead = true;
      }
    },

    markAllAsRead(state) {
      state.notifications.forEach(x => {
        x.isRead = true;
      });
    },

    clearNotifications(state) {
      state.notifications = [];
    },
  },
});

export const {
  notificationsLoaded,
  notificationReceived,
  markAsRead,
  markAllAsRead,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;