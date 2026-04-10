import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Banknote,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// ── Config ────────────────────────────────────────────────────────────────
const STATS_CONFIG = [
  {
    key: "orders",
    label: "ORDERS",
    icon: Package,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    key: "sales",
    label: "SALES",
    icon: ShoppingCart,
    iconBg: "bg-chart-2/10",
    iconColor: "text-chart-2",
  },
  {
    key: "revenue",
    label: "REVENUE",
    icon: Banknote,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-600",
  },
] as const;

// ── Mock Data ─────────────────────────────────────────────────────────────
const mockStats = [
  {
    key: "orders",
    value: 1240,
    change: 18.4,
  },
  {
    key: "sales",
    value: "842 items",
    change: -6.2,
  },
  {
    key: "revenue",
    value: "KES 482,300",
    change: 12.7,
  },
];

// ── Badge ────────────────────────────────────────────────────────────────
function StatBadge({ value }: { value: number }) {
  const positive = value >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
        positive ? "text-green-600" : "text-destructive"
      }`}
    >
      <Icon size={10} />
      {Math.abs(value)}% (last month)
    </span>
  );
}

// ── Component ─────────────────────────────────────────────────────────────
const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      {STATS_CONFIG.map((config, i) => {
        const stat = mockStats[i];
        const Icon = config.icon;

        return (
          <Card key={config.key} className="border-border/60">
            <CardContent className="pt-3 pb-3">
              <div className="flex flex-col gap-1.5">
                {/* Header */}
                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center justify-center w-6 h-6 rounded-lg ${config.iconBg}`}
                  >
                    <Icon size={12} className={config.iconColor} />
                  </span>
                  <span className="text-[9px] font-semibold tracking-wider text-muted-foreground">
                    {config.label}
                  </span>
                </div>

                {/* Value */}
                <p className="text-lg font-bold text-foreground leading-none">
                  {stat.value}
                </p>

                {/* Change */}
                <StatBadge value={stat.change} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;