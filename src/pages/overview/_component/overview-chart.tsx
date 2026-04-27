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
  orders: { label: "Total Orders", color: "var(--primary)" },
  revenue: { label: "Revenue (KES)", color: "var(--chart-2)" },
} as const;

const chartConfig: ChartConfig = {
  orders: { label: "Orders", color: "var(--primary)" },
  revenue: { label: "Revenue", color: "var(--chart-2)" },
};

const formatRevenue = (value: number) =>
  `KES ${value.toLocaleString("en-KE")}`;

export function OverviewChart() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof CHART_TYPES>("orders");

  const isEmpty = chartData.length === 0;

  const totals = {
    orders: chartData.reduce((a, b) => a + (b.orders || 0), 0),
    revenue: chartData.reduce((a, b) => a + (b.revenue || 0), 0),
  };

  return (
    <Card className="pt-5 lg:pt-0 border-border/60 shadow-xs">
      {/* Header */}
      <CardHeader className="flex flex-row justify-between px-6 py-5 border-b">
        <div>
          <CardTitle className="text-base">Sales Report</CardTitle>
          <CardDescription className="text-xs">
            Overview of orders and revenue
          </CardDescription>
        </div>

        {!isEmpty && (
          <div className="flex">
            {Object.entries(CHART_TYPES).map(([key, config]) => {
              const value = totals[key as keyof typeof totals];

              return (
                <button
                  key={key}
                  onClick={() => setActiveChart(key as any)}
                  className={cn(
                    "px-6 py-3 text-left",
                    activeChart === key && "bg-muted"
                  )}
                >
                  <p className="text-xs text-muted-foreground">
                    {config.label}
                  </p>
                  <p className="text-xl font-bold">
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
      <CardContent className="p-6">
        {isEmpty ? (
          // ── EMPTY STATE ─────────────────────────────────────────────
          <div className="h-[250px] flex flex-col items-center justify-center text-center">
            <p className="text-sm font-medium">No analytics data yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Sales reports will appear once orders start coming in.
            </p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[250px]">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="date"
                tickFormatter={(v) =>
                  new Date(v).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />

              <ChartTooltip content={<ChartTooltipContent />} />

              <Bar
                dataKey={activeChart}
                fill={CHART_TYPES[activeChart].color}
                radius={[4, 4, 0, 0]}
              />

              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        )}

        {/* Fulfillment can also be hidden if no data */}
        {!isEmpty && (
          <OrderFulfillmentRate
            completed={120}
            pending={40}
            cancelled={15}
            total={175}
          />
        )}
      </CardContent>
    </Card>
  );
}