export type ReportCategory =
  | "Financial"
  | "Inventory"
  | "Customers"
  | "Orders"
  | "Operations";

export type ReportCadence = "Updated daily" | "Monthly" | "Real-time" | "Weekly";

export interface Report {
  id: string;
  title: string;
  category: ReportCategory;
  description: string;
  cadence: ReportCadence;
  icon: LucideIconName;
  available: boolean; // false => "Coming Soon"
  href?: string;
}

// keep this in sync with the icon map in report-card.tsx
export type LucideIconName =
  | "CreditCard"
  | "FileText"
  | "Clock"
  | "PieChart"
  | "ClipboardList"
  | "Building2";
/* =========================================================
 * Report data (GET /v1/admin/reports/{id})
 * ========================================================= */

export type ReportValueFormat =
  | "text"
  | "number"
  | "currency"
  | "percent"
  | "date"
  | "datetime";

export interface ReportColumn {
  key: string;
  label: string;
  format: ReportValueFormat;
}

export interface ReportMetric {
  label: string;
  value: number;
  format: ReportValueFormat;
}

export interface ReportResult {
  id: string;
  title: string;
  from?: string | null;
  to?: string | null;
  generatedAtUtc: string;
  summary: ReportMetric[];
  columns: ReportColumn[];
  rows: Record<string, string | number | boolean | null>[];
  truncated: boolean;
}

export type ReportGroupBy = "day" | "week" | "month";

export interface ReportParams {
  from?: string;
  to?: string;
  groupBy?: ReportGroupBy;
  threshold?: number;
}
