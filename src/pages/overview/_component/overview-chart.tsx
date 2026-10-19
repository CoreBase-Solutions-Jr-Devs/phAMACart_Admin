import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import OrderFulfillmentRate from "./order-fulfillment-rate";
import { cn } from "@/lib/utils";

// ── No Data Yet ─────────────────────────────────────────────────────────────
const chartData: any[] = []; // replace later with API data

const CHART_TYPES = {
  orders: {
    label: "Total Orders",
    color: "var(--primary)",
  },
  revenue: {
    label: "Revenue (KES)",
    color: "var(--chart-2)",
  },
} as const;

const chartConfig: ChartConfig = {
  orders: {
    label: "Orders",
    color: "var(--primary)",
  },
  revenue: {
    label: "Revenue",
    color: "var(--chart-2)",
  },
};

const formatRevenue = (value: number) =>
  `KES ${value.toLocaleString("en-KE")}`;

export function OverviewChart() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof CHART_TYPES>("orders");

  const isEmpty = chartData.length === 0;

  const totals = {
    orders: chartData.reduce(
      (total, item) => total + (item.orders || 0),
      0
    ),
    revenue: chartData.reduce(
      (total, item) => total + (item.revenue || 0),
      0
    ),
  };

  return (
    <Card className="h-fit self-start border-border/60 shadow-xs">
      {/* Header */}
      <CardHeader className="border-b px-5 py-4">
        <div>
          <CardTitle className="text-sm font-semibold">
            Sales Report
          </CardTitle>

          <CardDescription className="mt-0.5 text-xs">
            Overview of orders and revenue
          </CardDescription>
        </div>

        {!isEmpty && (
          <div className="mt-4 flex overflow-hidden rounded-lg border">
            {Object.entries(CHART_TYPES).map(([key, config]) => {
              const chartKey = key as keyof typeof totals;
              const value = totals[chartKey];

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setActiveChart(key as keyof typeof CHART_TYPES)
                  }
                  className={cn(
                    "flex-1 px-4 py-2.5 text-left transition-colors",
                    "hover:bg-muted/60",
                    activeChart === key && "bg-muted"
                  )}
                >
                  <p className="text-[11px] text-muted-foreground">
                    {config.label}
                  </p>

                  <p className="mt-0.5 text-sm font-semibold tracking-tight">
                    {key === "revenue"
                      ? formatRevenue(value)
                      : value.toLocaleString()}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </CardHeader>

      {/* Body */}
      <CardContent className="px-5 py-5">
        {isEmpty ? (
          <div className="flex min-h-[170px] flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-muted">
              <span className="text-sm text-muted-foreground">↗</span>
            </div>

            <p className="text-sm font-medium">
              No analytics data yet
            </p>

            <p className="mt-1 max-w-[240px] text-xs leading-relaxed text-muted-foreground">
              Sales reports will appear once orders start coming in.
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-[240px] w-full"
          >
            <BarChart
              data={chartData}
              margin={{
                top: 8,
                right: 4,
                left: 4,
                bottom: 4,
              }}
            >
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />

              <ChartTooltip
                content={<ChartTooltipContent />}
              />

              <Bar
                dataKey={activeChart}
                fill={CHART_TYPES[activeChart].color}
                radius={[4, 4, 0, 0]}
              />

              <ChartLegend
                content={<ChartLegendContent />}
              />
            </BarChart>
          </ChartContainer>
        )}

        {!isEmpty && (
          <div className="mt-5 border-t pt-5">
            <OrderFulfillmentRate
              completed={120}
              pending={40}
              cancelled={15}
              total={175}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}