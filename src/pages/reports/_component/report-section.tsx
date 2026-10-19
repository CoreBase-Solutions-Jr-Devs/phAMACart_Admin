import {
  Report,
  ReportCategory,
} from "@/features/reports/reportsType";
import ReportCard from "./report-card";

const categoryDotColor: Record<
  ReportCategory,
  string
> = {
  Financial: "bg-primary",
  Inventory: "bg-chart-2",
  Customers: "bg-chart-3",
  Orders: "bg-chart-4",
  Operations: "bg-chart-5",
};

interface ReportSectionProps {
  category: ReportCategory;
  reports: Report[];
}

const ReportSection = ({
  category,
  reports,
}: ReportSectionProps) => {
  if (reports.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 last:mb-0">
      <div className="mb-4 flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${categoryDotColor[category]}`}
        />

        <h2 className="text-sm font-semibold text-foreground">
          {category}
        </h2>

        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
          {reports.length}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
          />
        ))}
      </div>
    </section>
  );
};

export default ReportSection;