import { Badge } from "@/components/ui/badge";
import { humanize } from "@/lib/format-display";
import { cn } from "@/lib/utils";
import { ORDER_STATUS } from "@/features/overview/overviewType";

const TONE: Record<string, string> = {
  Delivered: "bg-green-500/10 text-green-700 dark:text-green-400",
  Collected: "bg-green-500/10 text-green-700 dark:text-green-400",
  Paid: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  Processing: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  Shipped: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
  ReadyForPickup: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
  AwaitingConfirmation: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  AwaitingPayment: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  PaymentFailed: "bg-red-500/10 text-red-700 dark:text-red-400",
  Cancelled: "bg-muted text-muted-foreground",
};

/** Accepts the status name (list) or number (order detail). */
export const OrderStatusBadge = ({ status }: { status: string | number }) => {
  const name = typeof status === "number" ? ORDER_STATUS[status] ?? String(status) : status;

  return (
    <Badge
      variant="secondary"
      className={cn("font-medium", TONE[name] ?? "bg-muted text-foreground")}
    >
      {humanize(name)}
    </Badge>
  );
};
