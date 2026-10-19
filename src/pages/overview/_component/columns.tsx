import { ColumnDef } from "@tanstack/react-table";
import { Eye, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderAdminDto } from "@/features/overview/overviewType";

const STATUS_CONFIG: Record<string, { color: string; icon: any }> = {
  completed: { color: "text-green-600", icon: CheckCircle2 },
  delivered: { color: "text-green-600", icon: CheckCircle2 },
  pending: { color: "text-amber-600", icon: Clock },
  cancelled: { color: "text-red-500", icon: XCircle },
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-KE", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

type OrdersColumnsOptions = {
  onView: (order: OrderAdminDto) => void;
};

export const ordersColumns = ({
  onView,
}: OrdersColumnsOptions): ColumnDef<OrderAdminDto>[] => [
  {
    accessorKey: "orderNo",
    header: "Order No",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.orderNo}</span>
    ),
  },
  {
    accessorKey: "itemsCount",
    header: "Items",
    cell: ({ row }) => row.original.itemsCount,
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
    cell: ({ row }) => (
      <span className="font-semibold">
        KES {row.original.totalPrice.toLocaleString("en-KE")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const key = row.original.status.toLowerCase();
      const config = STATUS_CONFIG[key] ?? STATUS_CONFIG.pending;
      const Icon = config.icon;
      return (
        <span className={`flex items-center gap-1 text-xs capitalize ${config.color}`}>
          <Icon size={12} />
          {row.original.status}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(row.original)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
        >
          <Eye size={12} />
          View
        </Button>
      </div>
    ),
  },
];