import {
  CreditCard,
  FileText,
  Clock,
  PieChart,
  ClipboardList,
  Building2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Report,
  LucideIconName,
} from "@/features/reports/reportsType";

const iconMap: Record<
  LucideIconName,
  React.ElementType
> = {
  CreditCard,
  FileText,
  Clock,
  PieChart,
  ClipboardList,
  Building2,
};

interface ReportCardProps {
  report: Report;
}

const ReportCard = ({
  report,
}: ReportCardProps) => {
  const Icon = iconMap[report.icon];

  return (
    <div
      className={cn(
        "group flex flex-col rounded-xl border border-border bg-card p-5",
        "shadow-sm transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            "bg-accent text-primary",
            "transition-colors group-hover:bg-primary group-hover:text-primary-foreground",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-card-foreground">
            {report.title}
          </h3>

          <span className="text-xs font-medium text-primary">
            {report.category}
          </span>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-5 text-muted-foreground">
        {report.description}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        {report.available ? (
          <Link
            to={report.href ?? "#"}
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium",
              "text-primary transition-colors",
              "hover:text-accent-foreground",
            )}
          >
            View Report
            <ArrowRight
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                "group-hover:translate-x-0.5",
              )}
            />
          </Link>
        ) : (
          <span className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            Coming Soon
          </span>
        )}

        <span className="text-xs text-muted-foreground">
          {report.cadence}
        </span>
      </div>
    </div>
  );
};

export default ReportCard;