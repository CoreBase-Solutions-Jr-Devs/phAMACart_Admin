import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead?: boolean;
  onClick?: () => void;
}

const NotificationItem = ({
  title,
  message,
  createdAt,
  isRead,
  onClick,
}: NotificationItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 transition-colors hover:bg-muted border-b last:border-b-0",
        !isRead && "bg-primary/5"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="font-medium">{title}</p>

          <p className="text-sm text-muted-foreground">
            {message}
          </p>
        </div>

        {!isRead && (
          <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
        )}
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        {formatDistanceToNow(new Date(createdAt), {
          addSuffix: true,
        })}
      </p>
    </button>
  );
};

export default NotificationItem;