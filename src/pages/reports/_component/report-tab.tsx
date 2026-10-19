import {
  Report,
  ReportCategory,
} from "@/features/reports/reportsType";
import { cn } from "@/lib/utils";

interface ReportsTabsProps {
  reports: Report[];
  activeTab: ReportCategory | "All";
  onTabChange: (
    tab: ReportCategory | "All",
  ) => void;
}

const categories: ReportCategory[] = [
  "Financial",
  "Inventory",
  "Customers",
  "Orders",
  "Operations",
];

const badgeStyles: Record<
  ReportCategory | "All",
  string
> = {
  All: "bg-primary text-primary-foreground",
  Financial: "bg-accent text-accent-foreground",
  Inventory: "bg-muted text-muted-foreground",
  Customers: "bg-muted text-muted-foreground",
  Orders: "bg-muted text-muted-foreground",
  Operations: "bg-muted text-muted-foreground",
};

const ReportsTabs = ({
  reports,
  activeTab,
  onTabChange,
}: ReportsTabsProps) => {
  const countFor = (
    tab: ReportCategory | "All",
  ) =>
    tab === "All"
      ? reports.length
      : reports.filter(
          (report) => report.category === tab,
        ).length;

  const tabs: (
    | ReportCategory
    | "All"
  )[] = ["All", ...categories];

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-center gap-1 border-b border-border px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={cn(
                "relative flex items-center gap-2",
                "border-b-2 px-3 py-3",
                "text-sm font-medium",
                "transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {tab}

              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                  isActive
                    ? badgeStyles.All
                    : badgeStyles[tab],
                )}
              >
                {countFor(tab)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ReportsTabs;