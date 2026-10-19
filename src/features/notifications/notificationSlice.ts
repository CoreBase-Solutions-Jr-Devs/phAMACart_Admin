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
      state.notifications = action.payload;
    },

    notificationReceived(
      state,
      action: PayloadAction<NotificationDto>
    ) {
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