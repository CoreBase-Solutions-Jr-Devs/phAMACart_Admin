import {
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

import NotificationItem from "./notification-item";
import NotificationEmpty from "./notification-empty";

import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

const NotificationDropdown = () => {
  const notifications = useSelector(
    (state: RootState) =>
      state.notifications.notifications
  );

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
            />
          ))
        )}
      </div>
    </DropdownMenuContent>
  );
};

export default NotificationDropdown;