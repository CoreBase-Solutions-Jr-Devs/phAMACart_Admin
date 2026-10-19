import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import OrdersTable from "./orders-table";

const RecentOrders = () => {
  return (
    <Card className="w-full border-border/60 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between px-5 py-4">
        <CardTitle className="text-sm font-semibold tracking-tight">
          Recent Orders
        </CardTitle>

        <Link
          to="/orders"
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          View All
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </CardHeader>

      <CardContent className="px-5 pb-4 pt-0">
        <OrdersTable />
      </CardContent>
    </Card>
  );
};

export default RecentOrders;