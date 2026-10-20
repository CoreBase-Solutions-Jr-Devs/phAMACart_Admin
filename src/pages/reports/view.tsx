import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Download,
  RefreshCw,
} from "lucide-react";

import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { useGetReportQuery } from "@/features/reports/reportsAPI";
import type {
  ReportColumn,
  ReportGroupBy,
  ReportValueFormat,
} from "@/features/reports/reportsType";
import {
  formatDate,
  formatDateTime,
  formatKES,
  formatNumber,
  humanize,
  toDateInput,
} from "@/lib/format-display";
import { parseError } from "@/lib/parse-error";
import { cn } from "@/lib/utils";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";

/** Reports that group by period accept day/week/month. */
const PERIOD_REPORTS = new Set(["sales-report", "revenue-summary", "tax-report"]);

/** Stock reports are snapshots: the date range doesn't apply. */
const SNAPSHOT_REPORTS = new Set(["inventory-report", "low-stock"]);

const PAGE_SIZE = 50;

const PRESETS = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "1 year", days: 365 },
];

type CellValue = string | number | boolean | null | undefined;

/** Columns whose text values are enum names ("AwaitingPayment") worth spacing out. */
const ENUM_COLUMN = /status|state|method|collection|sync|reason|verified|^value$/i;

const formatCell = (
  value: CellValue,
  format: ReportValueFormat,
  key = "",
) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  switch (format) {
    case "currency":
      return formatKES(Number(value));
    case "number":
      return formatNumber(Number(value));
    case "percent":
      return `${formatNumber(Number(value))}%`;
    case "date":
      return /^\d{4}-\d{2}$/.test(String(value))
        ? String(value) // a month period ("2026-10")
        : formatDate(String(value));
    case "datetime":
      return formatDateTime(String(value));
    default:
      return typeof value === "string" && ENUM_COLUMN.test(key)
        ? humanize(value)
        : String(value);
  }
};

const csvEscape = (value: CellValue) => {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const ReportView = () => {
  const { reportId = "" } = useParams();
  const today = new Date();

  const [from, setFrom] = useState(
    toDateInput(new Date(today.getTime() - 30 * 86_400_000)),
  );
  const [to, setTo] = useState(toDateInput(today));
  const [groupBy, setGroupBy] = useState<ReportGroupBy>("day");
  const [threshold, setThreshold] = useState(10);
  const [sort, setSort] = useState<{ key: string; desc: boolean } | null>(null);
  const [page, setPage] = useState(0);

  const isPeriodReport = PERIOD_REPORTS.has(reportId);
  const isSnapshot = SNAPSHOT_REPORTS.has(reportId);

  const { data, isFetching, isError, error, refetch } = useGetReportQuery(
    {
      id: reportId,
      params: isSnapshot
        ? { threshold: reportId === "low-stock" ? threshold : undefined }
        : {
            from: from ? new Date(`${from}T00:00:00`).toISOString() : undefined,
            to: to ? new Date(`${to}T23:59:59`).toISOString() : undefined,
            groupBy: isPeriodReport ? groupBy : undefined,
          },
    },
    { skip: !reportId },
  );

  const rows = useMemo(() => {
    const source = data?.rows ?? [];
    if (!sort) return source;

    return [...source].sort((a, b) => {
      const x = a[sort.key];
      const y = b[sort.key];
      if (x === y) return 0;
      if (x === null || x === undefined) return 1;
      if (y === null || y === undefined) return -1;
      const result =
        typeof x === "number" && typeof y === "number"
          ? x - y
          : String(x).localeCompare(String(y));
      return sort.desc ? -result : result;
    });
  }, [data, sort]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pageRows = rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const applyPreset = (days: number) => {
    const end = new Date();
    setFrom(toDateInput(new Date(end.getTime() - days * 86_400_000)));
    setTo(toDateInput(end));
    setPage(0);
  };

  const toggleSort = (column: ReportColumn) => {
    setPage(0);
    setSort((current) =>
      current?.key === column.key
        ? current.desc
          ? null
          : { key: column.key, desc: true }
        : { key: column.key, desc: false },
    );
  };

  const exportCsv = () => {
    if (!data) return;

    const header = data.columns.map((c) => csvEscape(c.label)).join(",");
    const lines = rows.map((row) =>
      data.columns.map((c) => csvEscape(row[c.key])).join(","),
    );
    const blob = new Blob([[header, ...lines].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${data.id}_${isSnapshot ? toDateInput(new Date()) : `${from}_${to}`}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageLayout
      title={data?.title ?? "Report"}
      subtitle={
        isSnapshot
          ? "Current stock snapshot"
          : data
            ? `${formatDate(data.from)} – ${formatDate(data.to)}`
            : "Loading…"
      }
      rightAction={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={PROTECTED_ROUTES.REPORTS}>
              <ArrowLeft className="size-4" />
              All reports
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={cn("size-4", isFetching && "animate-spin")} />
            Refresh
          </Button>
          <Button size="sm" onClick={exportCsv} disabled={!data || rows.length === 0}>
            <Download className="size-4" />
            Export CSV
          </Button>
        </div>
      }
    >
      <div className="mx-auto w-full max-w-[1600px] space-y-5">
        {/* Filters */}
        <Card className="py-4">
          <CardContent className="flex flex-wrap items-end gap-4 px-4">
            {!isSnapshot && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="report-from" className="text-xs">From</Label>
                  <Input
                    id="report-from"
                    type="date"
                    value={from}
                    max={to}
                    onChange={(e) => {
                      setFrom(e.target.value);
                      setPage(0);
                    }}
                    className="w-40"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="report-to" className="text-xs">To</Label>
                  <Input
                    id="report-to"
                    type="date"
                    value={to}
                    min={from}
                    onChange={(e) => {
                      setTo(e.target.value);
                      setPage(0);
                    }}
                    className="w-40"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRESETS.map((preset) => (
                    <Button
                      key={preset.days}
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(preset.days)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </>
            )}

            {isPeriodReport && (
              <div className="space-y-1.5">
                <Label className="text-xs">Group by</Label>
                <Select
                  value={groupBy}
                  onValueChange={(value) => setGroupBy(value as ReportGroupBy)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {reportId === "low-stock" && (
              <div className="space-y-1.5">
                <Label htmlFor="report-threshold" className="text-xs">
                  Stock at or below
                </Label>
                <Input
                  id="report-threshold"
                  type="number"
                  min={1}
                  value={threshold}
                  onChange={(e) => setThreshold(Math.max(1, Number(e.target.value) || 1))}
                  className="w-28"
                />
              </div>
            )}

            {isSnapshot && reportId !== "low-stock" && (
              <p className="text-sm text-muted-foreground">
                Stock levels as they are right now. Export to keep a dated copy.
              </p>
            )}
          </CardContent>
        </Card>

        {isError ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-destructive">
              {parseError(error)}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {(data?.summary ?? Array.from({ length: 4 }, () => null)).map(
                (metric, index) => (
                  <Card key={metric?.label ?? index} className="py-4">
                    <CardContent className="px-4">
                      {metric && !isFetching ? (
                        <>
                          <p className="text-xs font-medium text-muted-foreground">
                            {metric.label}
                          </p>
                          <p className="mt-1 text-xl font-semibold tracking-tight tabular-nums">
                            {formatCell(metric.value, metric.format)}
                          </p>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-6 w-28" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ),
              )}
            </div>

            {data?.truncated && (
              <p className="text-sm text-amber-600">
                Showing the first {formatNumber(data.rows.length)} rows. Narrow
                the date range to see everything.
              </p>
            )}

            {/* Rows */}
            <Card className="overflow-hidden !py-0">
              {isFetching && !data ? (
                <div className="space-y-2 p-4">
                  {Array.from({ length: 8 }, (_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : rows.length === 0 ? (
                <EmptyState
                  title="Nothing to report"
                  description={
                    isSnapshot
                      ? "No products match."
                      : "No data in this period. Try a wider date range."
                  }
                />
              ) : (
                <div className={cn("overflow-x-auto", isFetching && "opacity-60")}>
                  <Table>
                    <TableHeader className="bg-muted">
                      <TableRow>
                        {data!.columns.map((column) => {
                          const numeric = ["number", "currency", "percent"].includes(column.format);
                          return (
                            <TableHead
                              key={column.key}
                              className={cn("whitespace-nowrap !text-[13px]", numeric && "text-right")}
                            >
                              <button
                                type="button"
                                onClick={() => toggleSort(column)}
                                className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                              >
                                {column.label}
                                {sort?.key === column.key &&
                                  (sort.desc ? (
                                    <ArrowDown className="size-3" />
                                  ) : (
                                    <ArrowUp className="size-3" />
                                  ))}
                              </button>
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageRows.map((row, index) => (
                        <TableRow key={page * PAGE_SIZE + index}>
                          {data!.columns.map((column) => {
                            const numeric = ["number", "currency", "percent"].includes(column.format);
                            return (
                              <TableCell
                                key={column.key}
                                className={cn(
                                  "whitespace-nowrap !text-[13.3px]",
                                  numeric && "text-right tabular-nums",
                                )}
                              >
                                {formatCell(row[column.key], column.format, column.key)}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>

            {rows.length > PAGE_SIZE && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Rows {formatNumber(page * PAGE_SIZE + 1)}–
                  {formatNumber(Math.min(rows.length, (page + 1) * PAGE_SIZE))} of{" "}
                  {formatNumber(rows.length)}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= pageCount - 1}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default ReportView;
