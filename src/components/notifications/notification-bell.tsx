import { Bell } from "lucide-react";
import { useSelector } from "react-redux";

import { RootState } from "@/app/store";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import NotificationDropdown from "./notification-dropdown";

const NotificationBell = () => {
  const unreadCount = useSelector(
    (state: RootState) =>
      state.notifications.notifications.filter(
        (x) => !x.isRead
      ).length
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative shrink-0"
        >
          <Bell className="h-5 w-5" />

          {unreadCount > 0 && (
            <Badge
              className="
                absolute
                -top-1.5
                -right-1.5
                h-5
                min-w-5
                rounded-full
                px-1
                flex
                items-center
                justify-center
                text-[10px]
                leading-none
                pointer-events-none
              "
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <NotificationDropdown />
    </DropdownMenu>
  );
};

export default NotificationBell;