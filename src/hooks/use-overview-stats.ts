import { useMemo } from "react";
import { useGetReportQuery } from "@/features/reports/reportsAPI";
import { toDateInput } from "@/lib/format-display";

/** Order statuses that count as a completed sale (payment taken or confirmed). */
const SALE = new Set(["Paid", "Processing", "Shipped", "Delivered", "ReadyForPickup", "Collected"]);
const FULFILLED = new Set(["Delivered", "Collected"]);
const LOST = new Set(["Cancelled", "PaymentFailed"]);

const DAY = 86_400_000;
const WINDOW_DAYS = 30;

interface OrderRow {
  date: string;
  customer: string;
  total: number;
  status: string;
}

export interface OverviewStat {
  value: number;
  /** % change vs the previous 30 days; null when there is nothing to compare with. */
  change: number | null;
}

const change = (current: number, previous: number) =>
  previous === 0 ? null : Math.round(((current - previous) / previous) * 1000) / 10;

/**
 * Dashboard numbers for the last 30 days (vs the 30 before), from one
 * orders-report call. Refreshes every 5 minutes.
 */
export const useOverviewStats = () => {
  // Stable for the session so the query isn't re-keyed every render.
  const range = useMemo(() => {
    const now = new Date();
    return {
      now,
      from: new Date(now.getTime() - 2 * WINDOW_DAYS * DAY).toISOString(),
      to: now.toISOString(),
    };
  }, []);

  const { data, isLoading, isFetching, isError } = useGetReportQuery(
    { id: "orders-report", params: { from: range.from, to: range.to } },
    { pollingInterval: 5 * 60_000 },
  );

  return useMemo(() => {
    const rows = (data?.rows ?? []) as unknown as OrderRow[];
    const split = range.now.getTime() - WINDOW_DAYS * DAY;

    const current = rows.filter((r) => new Date(r.date).getTime() >= split);
    const previous = rows.filter((r) => new Date(r.date).getTime() < split);

    const summarize = (list: OrderRow[]) => {
      const sales = list.filter((r) => SALE.has(r.status));
      return {
        orders: list.length,
        sales: sales.length,
        revenue: sales.reduce((sum, r) => sum + Number(r.total || 0), 0),
        customers: new Set(sales.map((r) => r.customer)).size,
      };
    };

    const now = summarize(current);
    const before = summarize(previous);

    const stats: Record<"orders" | "sales" | "revenue" | "customers", OverviewStat> = {
      orders: { value: now.orders, change: change(now.orders, before.orders) },
      sales: { value: now.sales, change: change(now.sales, before.sales) },
      revenue: { value: now.revenue, change: change(now.revenue, before.revenue) },
      customers: { value: now.customers, change: change(now.customers, before.customers) },
    };

    // One bar per calendar day the 30-day window touches (31), including empty days.
    const byDay = new Map<string, { date: string; orders: number; revenue: number }>();
    for (let i = WINDOW_DAYS; i >= 0; i--) {
      const key = toDateInput(new Date(range.now.getTime() - i * DAY));
      byDay.set(key, { date: key, orders: 0, revenue: 0 });
    }
    for (const row of current) {
      const bucket = byDay.get(toDateInput(new Date(row.date)));
      if (!bucket) continue;
      bucket.orders += 1;
      if (SALE.has(row.status)) bucket.revenue += Number(row.total || 0);
    }

    const fulfilment = {
      total: current.length,
      completed: current.filter((r) => FULFILLED.has(r.status)).length,
      cancelled: current.filter((r) => LOST.has(r.status)).length,
      pending: current.filter((r) => !FULFILLED.has(r.status) && !LOST.has(r.status)).length,
    };

    return {
      stats,
      chart: [...byDay.values()],
      fulfilment,
      hasData: rows.length > 0,
      isLoading,
      isFetching,
      isError,
    };
  }, [data, isLoading, isFetching, isError, range]);
};
