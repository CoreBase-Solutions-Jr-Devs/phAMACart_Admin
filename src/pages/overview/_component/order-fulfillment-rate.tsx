import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface Props {
  completed: number;
  pending: number;
  cancelled: number;
  total: number;
}

const pct = (part: number, total: number) =>
  total > 0 ? Math.round((part / total) * 100) : 0;

const OrderFulfillmentRate = ({
  completed,
  pending,
  cancelled,
  total,
}: Props) => {
  const items = [
    {
      label: "Completed",
      pct: pct(completed, total),
      color: "bg-chart-2",
      icon: CheckCircle2,
    },
    {
      label: "Pending",
      pct: pct(pending, total),
      color: "bg-amber-400",
      icon: Clock,
    },
    {
      label: "Cancelled",
      pct: pct(cancelled, total),
      color: "bg-muted-foreground/40",
      icon: XCircle,
    },
  ];

  return (
    <div className="border rounded-lg p-4 mt-4">
      <p className="text-xs mb-2 text-muted-foreground">
        Order Fulfillment Rate ({total} orders)
      </p>

      <div className="flex h-2 rounded-full overflow-hidden mb-3">
        {items.map((i) => (
          <div key={i.label} className={i.color} style={{ width: `${i.pct}%` }} />
        ))}
      </div>

      <div className="flex gap-4 text-xs">
        {items.map((i) => {
          const Icon = i.icon;
          return (
            <div key={i.label} className="flex items-center gap-1">
              <Icon size={12} />
              {i.label} {i.pct}%
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderFulfillmentRate;