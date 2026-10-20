import {
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

import NotificationItem from "./notification-item";
import NotificationEmpty from "./notification-empty";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useMarkNotificationReadMutation } from "@/features/notifications/notificationAPI";
import { markAsRead } from "@/features/notifications/notificationSlice";

const NotificationDropdown = () => {
  const dispatch = useDispatch();
  const [markRead] = useMarkNotificationReadMutation();

  const notifications = useSelector(
    (state: RootState) =>
      state.notifications.notifications
  );

  const handleClick = (id: string, isRead?: boolean) => {
    if (isRead) {
      return;
    }

    // Optimistic: the badge drops at once; the server call is best-effort.
    dispatch(markAsRead(id));
    markRead(id).catch(() => undefined);
  };

  return (
    <DropdownMenuContent
      align="end"
      className="w-[420px] p-0"
    >
      <div className="border-b px-4 py-3">
        <h3 className="font-semibold">
          Notifications
        </h3>
      </div>

      <div className="max-h-[450px] overflow-y-auto">
        {notifications.length === 0 ? (
          <NotificationEmpty />
        ) : (
          notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              {...notification}
              onClick={() =>
                handleClick(notification.id, notification.isRead)
              }
            />
          ))
        )}
      </div>
    </DropdownMenuContent>
  );
};

export default NotificationDropdown;