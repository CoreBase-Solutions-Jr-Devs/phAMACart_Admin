"use client";

import { useMemo, useState } from "react";
import PageLayout from "@/components/page-layout";
import ReportSection from "./_component/report-section";
import ReportsTabs from "./_component/report-tab";
import {
  ReportCategory,
} from "@/features/reports/reportsType";
import { reportsData } from "./_data/reports";

const categories: ReportCategory[] = [
  "Financial",
  "Inventory",
  "Customers",
  "Orders",
  "Operations",
];

const Reports = () => {
  const [activeTab, setActiveTab] =
    useState<ReportCategory | "All">("All");

  const visibleCategories = useMemo(
    () =>
      activeTab === "All"
        ? categories
        : [activeTab],
    [activeTab],
  );

  return (
    <PageLayout
      title="Reports"
      subtitle="Dashboard / Reports"
    >
      <div className="mx-auto mt-4 w-full max-w-[1600px]">
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="p-4 sm:p-5">
            <ReportsTabs
              reports={reportsData}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className="mt-6">
              {visibleCategories.map(
                (category) => (
                  <ReportSection
                    key={category}
                    category={category}
                    reports={reportsData.filter(
                      (report) =>
                        report.category ===
                        category,
                    )}
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Reports;