import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Eye, CheckCircle2, Clock, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

// ── Mock Data ───────────────────────────────────────────────────────────────
const orders = Array.from({ length: 22 }, (_, i) => ({
  id: `#ORD-${(i + 1).toString().padStart(3, "0")}`,
  customer: ["John Doe", "Jane Smith", "Alex Mwangi", "Mary Wanjiku", "Peter Otieno"][i % 5],
  items: Math.floor(Math.random() * 5) + 1,
  total: Math.floor(Math.random() * 10000) + 1000,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  status: ["completed", "pending", "cancelled"][i % 3],
}));

// ── Status Styles & Icons ───────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { color: string; icon: React.FC<{ size?: number; className?: string }> }> = {
  completed: { color: "bg-green-500/10 text-green-600", icon: CheckCircle2 },
  pending: { color: "bg-amber-500/10 text-amber-600", icon: Clock },
  cancelled: { color: "bg-muted text-muted-foreground", icon: XCircle },
};

// ── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-KE", { month: "short", day: "numeric" });

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("");

// ── Component ───────────────────────────────────────────────────────────────
const RecentOrders = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(orders.length / pageSize);

  const displayedOrders = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <Card className="border-border/60 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Recent Orders</CardTitle>

        <Link
          to="/orders"
          className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
        >
          View All
          <ArrowUpRight size={12} />
        </Link>
      </CardHeader>

      <CardContent>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b">
                <th className="text-left py-2 font-medium">Order ID</th>
                <th className="text-left py-2 font-medium">Customer</th>
                <th className="text-left py-2 font-medium">Items</th>
                <th className="text-left py-2 font-medium">Total</th>
                <th className="text-left py-2 font-medium">Created</th>
                <th className="text-left py-2 font-medium">Status</th>
                <th className="text-right py-2 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {displayedOrders.map((order) => {
                const status = STATUS_CONFIG[order.status];
                const StatusIcon = status.icon;

                return (
                  <tr
                    key={order.id}
                    className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <td className="py-2 font-medium">{order.id}</td>

                    <td className="py-2 flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {getInitials(order.customer)}
                      </div>
                      {order.customer}
                    </td>

                    <td className="py-2">{order.items}</td>

                    <td className="py-2 font-semibold">
                      KES {order.total.toLocaleString("en-KE")}
                    </td>

                    <td className="py-2 text-muted-foreground">{formatDate(order.createdAt)}</td>

                    <td className="py-2 flex items-center gap-1">
                      <StatusIcon size={12} className={status.color.split(" ")[1]} />
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize ${status.color}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="py-2 text-right">
                      <Link
                        to={`/orders/${order.id}`}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                      >
                        <Eye size={12} />
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-muted/20 disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-muted/20 disabled:opacity-40"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;