import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useGetOrdersQuery } from "@/features/overview/overviewAPI";
import { ORDER_STATUS, type OrderAdminDto } from "@/features/overview/overviewType";
import { formatDateTime, formatKES, humanize } from "@/lib/format-display";
import { OrderStatusBadge } from "./order-status-badge";
import { OrderDetailsDialog } from "./order-details-dialog";

type Row = OrderAdminDto & { _id: string };

const ALL = "__all";

const OrdersTable = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(ALL);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(search, 350);

  const { data, isFetching } = useGetOrdersQuery({
    search: debouncedSearch.trim() || undefined,
    status: status === ALL ? undefined : status,
    fromDate: fromDate ? new Date(`${fromDate}T00:00:00`).toISOString() : undefined,
    toDate: toDate ? new Date(`${toDate}T23:59:59`).toISOString() : undefined,
    pageIndex: pageNumber - 1,
    pageSize,
    desc: true,
  });

  const rows: Row[] = (data?.orders.data ?? []).map((o) => ({ ...o, _id: o.id }));
  const total = data?.orders.count ?? 0;

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      {
        accessorKey: "orderNo",
        header: "Order",
        cell: ({ row }) => <span className="font-medium">{row.original.orderNo}</span>,
      },
      {
        accessorKey: "createdAt",
        header: "Placed",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{formatDateTime(row.original.createdAt)}</span>
        ),
      },
      {
        accessorKey: "itemsCount",
        header: "Lines",
        cell: ({ row }) => <span className="tabular-nums">{row.original.itemsCount}</span>,
      },
      {
        accessorKey: "totalPrice",
        header: "Total",
        cell: ({ row }) => (
          <span className="font-semibold tabular-nums">{formatKES(row.original.totalPrice)}</span>
        ),
      },
      {
        accessorKey: "paymentMethod",
        header: "Payment",
        cell: ({ row }) => humanize(row.original.paymentMethod),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "deliveredAt",
        header: "Delivered",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{formatDateTime(row.original.deliveredAt)}</span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setOpenOrderId(row.original.id);
            }}
          >
            <Eye className="size-3.5" />
            View
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="orders-search" className="text-xs">Order number</Label>
          <Input
            id="orders-search"
            placeholder="Search order no…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPageNumber(1);
            }}
            className="w-60"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Status</Label>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPageNumber(1);
            }}
          >
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All statuses</SelectItem>
              {Object.values(ORDER_STATUS).map((name) => (
                <SelectItem key={name} value={name}>
                  {humanize(name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="orders-from" className="text-xs">From</Label>
          <Input
            id="orders-from"
            type="date"
            value={fromDate}
            max={toDate || undefined}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPageNumber(1);
            }}
            className="w-40"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="orders-to" className="text-xs">To</Label>
          <Input
            id="orders-to"
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={(e) => {
              setToDate(e.target.value);
              setPageNumber(1);
            }}
            className="w-40"
          />
        </div>

        {(search || status !== ALL || fromDate || toDate) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setStatus(ALL);
              setFromDate("");
              setToDate("");
              setPageNumber(1);
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      <DataTable
        data={rows}
        columns={columns}
        isLoading={isFetching && !data}
        selection={false}
        showSearch={false}
        emptyTitle="No orders found"
        pagination={{
          totalItems: total,
          totalPages: Math.max(1, Math.ceil(total / pageSize)),
          pageNumber,
          pageSize,
        }}
        onPageChange={setPageNumber}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageNumber(1);
        }}
      />

      <OrderDetailsDialog
        orderId={openOrderId}
        onOpenChange={(open) => !open && setOpenOrderId(null)}
      />
    </div>
  );
};

export default OrdersTable;
