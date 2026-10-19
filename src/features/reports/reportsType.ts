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