import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrdersQuery } from "@/features/overview/overviewAPI";
import { formatDateTime, formatKES } from "@/lib/format-display";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { OrderStatusBadge } from "@/pages/orders/_component/order-status-badge";
import { OrderDetailsDialog } from "@/pages/orders/_component/order-details-dialog";

const RecentOrders = () => {
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  const { data, isLoading } = useGetOrdersQuery(
    { pageIndex: 0, pageSize: 8, desc: true },
    { pollingInterval: 60_000 },
  );

  const orders = data?.orders.data ?? [];

  return (
    <Card className="w-full border-border/60 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
        <CardTitle className="text-sm font-semibold tracking-tight">
          Recent Orders
        </CardTitle>

        <Link
          to={PROTECTED_ROUTES.ORDERS}
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </CardHeader>

      <CardContent className="px-5 pb-4 pt-0">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-11 w-full" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No orders yet. They will show here as customers check out.
          </p>
        ) : (
          <ul className="divide-y">
            {orders.map((order) => (
              <li key={order.id}>
                <button
                  type="button"
                  onClick={() => setOpenOrderId(order.id)}
                  className="flex w-full items-center gap-3 py-2.5 text-left transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{order.orderNo}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(order.createdAt)} · {order.itemsCount} line
                      {order.itemsCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                  <span className="w-28 text-right text-sm font-semibold tabular-nums">
                    {formatKES(order.totalPrice)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <OrderDetailsDialog
        orderId={openOrderId}
        onOpenChange={(open) => !open && setOpenOrderId(null)}
      />
    </Card>
  );
};

export default RecentOrders;
