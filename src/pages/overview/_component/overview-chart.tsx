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
import { format, subDays, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import OrderFulfillmentRate from "./order-fulfillment-rate";

// ── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_DAYS = 30;

const generateMockData = () => {
  const today = startOfDay(new Date());

  return Array.from({ length: MOCK_DAYS }, (_, i) => {
    const date = subDays(today, MOCK_DAYS - i);
    return {
      date: format(date, "yyyy-MM-dd"),
      orders: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(Math.random() * 50000) + 5000,
    };
  });
};

const mockChartData = generateMockData();

const totals = {
  orders: mockChartData.reduce((a, b) => a + b.orders, 0),
  revenue: mockChartData.reduce((a, b) => a + b.revenue, 0),
};

// ── Constants ───────────────────────────────────────────────────────────────
const COLORS = ["var(--primary)", "var(--chart-2)"] as const;

const CHART_TYPES = {
  orders: { label: "Total Orders", color: COLORS[0] },
  revenue: { label: "Revenue (KES)", color: COLORS[1] },
} as const;

const chartConfig: ChartConfig = {
  orders: { label: "Orders", color: COLORS[0] },
  revenue: { label: "Revenue", color: COLORS[1] },
};

const RANGE_OPTIONS = ["5D", "2W", "1M"] as const;
type RangeKey = (typeof RANGE_OPTIONS)[number];

// ── Helpers ─────────────────────────────────────────────────────────────────
const formatRevenue = (value: number) =>
  `KES ${value.toLocaleString("en-KE")}`;

// ── Component ────────────────────────────────────────────────────────────────
export function OverviewChart() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof CHART_TYPES>("orders");

  return (
    <Card className="pt-5 lg:pt-0 border-border/60 shadow-xs">
      {/* Header */}
      <CardHeader className="flex flex-row justify-between px-6 py-5 border-b">
        <div>
          <CardTitle className="text-base">Sales Report</CardTitle>
          <CardDescription className="text-xs">
            Test data
          </CardDescription>
        </div>

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
      </CardHeader>

      {/* Body */}
      <CardContent className="p-6">
        <ChartContainer config={chartConfig} className="h-[250px]">
          <BarChart data={mockChartData}>
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

        <OrderFulfillmentRate
          completed={120}
          pending={40}
          cancelled={15}
          total={175}
        />
      </CardContent>
    </Card>
  );
}