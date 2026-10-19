import { BellOff } from "lucide-react";

const NotificationEmpty = () => {
  return (
    <div className="py-10 flex flex-col items-center justify-center text-center">
      <BellOff className="h-8 w-8 text-muted-foreground mb-3" />

      <p className="font-medium">
        You're all caught up
      </p>

      <p className="text-sm text-muted-foreground">
        No notifications available.
      </p>
    </div>
  );
};

export default NotificationEmpty;