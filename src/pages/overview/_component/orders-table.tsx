import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DataTable } from "@/components/data-table";
import { useGetOrdersQuery } from "@/features/overview/overviewAPI";
import { ordersColumns } from "./columns";
import { OrderAdminDto } from "@/features/overview/overviewType";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

const ORDER_STATUSES = ["Pending", "Completed", "Delivered", "Cancelled"];

type FilterState = {
  search: string;
  status: string;
  fromDate: string;
  toDate: string;
  pageNumber: number;
  pageSize: number;
};
 

const OrdersTable = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState<FilterState>({
    search: "",
    status: "",
    fromDate: "",
    toDate: "",
    pageNumber: 1,
    pageSize: 10,
  });

  /* =========================
     DATA
  ========================= */
const { data, isFetching } = useGetOrdersQuery({
    search: filter.search || undefined,
    status: filter.status || undefined,
    fromDate: filter.fromDate ? new Date(filter.fromDate).toISOString() : undefined,
    toDate: filter.toDate ? new Date(`${filter.toDate}T23:59:59`).toISOString() : undefined,
    pageIndex: filter.pageNumber - 1,
    pageSize: filter.pageSize,
    desc: true,
  });

  const orders = data?.orders.data || [];

  /* =========================
     PAGINATION
  ========================= */
  const pagination = {
    totalCount: data?.orders.count || 0,
    totalPages: Math.ceil((data?.orders.count || 0) / filter.pageSize),
    pageNumber: filter.pageNumber,
    pageSize: filter.pageSize,
  };

  const handlePageChange = (pageNumber: number) =>
    setFilter((prev) => ({ ...prev, pageNumber }));

  const handlePageSizeChange = (pageSize: number) =>
    setFilter((prev) => ({ ...prev, pageSize, pageNumber: 1 }));

  /* =========================
     NAVIGATE TO DETAIL
  ========================= */
  const handleView = (order: OrderAdminDto) =>
    navigate(`/orders/${order.id}`);

  /* =========================
     COLUMNS
  ========================= */
  const columns = useMemo(
    () => ordersColumns({ onView: handleView }),
    []
  );

  return (
    <div className="space-y-4">
      {/* ================= FILTERS ================= */}
      <div className="flex flex-wrap gap-4 items-end">
        {/* SEARCH */}
        <Input
          placeholder="Search orders..."
          value={filter.search}
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              search: e.target.value,
              pageNumber: 1,
            }))
          }
          className="max-w-sm"
        />

        {/* STATUS */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[160px] justify-between">
              {filter.status || "All Statuses"}
              <ChevronDownIcon className="size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={() =>
                setFilter((prev) => ({ ...prev, status: "", pageNumber: 1 }))
              }
            >
              All Statuses
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {ORDER_STATUSES.map((s) => (
              <DropdownMenuItem
                key={s}
                onSelect={() =>
                  setFilter((prev) => ({ ...prev, status: s, pageNumber: 1 }))
                }
              >
                {s}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* DATE RANGE */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">From</label>
            <Input
              type="date"
              value={filter.fromDate}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                  pageNumber: 1,
                }))
              }
              className="w-40"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">To</label>
            <Input
              type="date"
              value={filter.toDate}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  endDate: e.target.value,
                  pageNumber: 1,
                }))
              }
              className="w-40"
            />
          </div>

          {(filter.fromDate || filter.toDate) && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-5 text-xs"
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  fromDate: "",
                  toDate: "",
                  pageNumber: 1,
                }))
              }
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <DataTable
        data={orders}
        columns={columns}
        isLoading={isFetching}
        selection={false}
        showSearch={false}
        emptyTitle="No orders found"
        isShowPagination={true}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default OrdersTable;