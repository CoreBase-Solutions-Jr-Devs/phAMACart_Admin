import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Banknote,
  Users,
  type LucideIcon,
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
  {
    key: "customers",
    label: "CUSTOMERS",
    icon: Users,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-600",
  },
] as const;

// ── No Data Yet ──────────────────────────────────────────────────────────
const statsData: Record<
  string,
  {
    value: string | number;
    change: number;
  }
> = {};

// ── Badge ─────────────────────────────────────────────────────────────────
function StatBadge({ value }: { value: number }) {
  const positive = value >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 text-[10px] font-medium ${
        positive ? "text-green-600" : "text-destructive"
      }`}
    >
      <Icon className="h-2.5 w-2.5" />
      {Math.abs(value)}%
      <span className="text-muted-foreground">last month</span>
    </span>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({
  config,
  stat,
  isEmpty,
}: {
  config: (typeof STATS_CONFIG)[number];
  stat?: {
    value: string | number;
    change: number;
  };
  isEmpty: boolean;
}) {
  const Icon = config.icon as LucideIcon;

  return (
    <Card className="w-full min-w-0 border-border/60 shadow-xs">
      <CardContent className="px-4 py-3.5">
        <div className="flex min-w-0 items-center justify-between gap-3">
          {/* Left */}
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.iconBg}`}
            >
              <Icon className={`h-3.5 w-3.5 ${config.iconColor}`} />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-medium tracking-wide text-muted-foreground">
                {config.label}
              </p>

              {isEmpty ? (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  No data yet
                </p>
              ) : (
                <p className="mt-0.5 truncate text-lg font-semibold tracking-tight">
                  {stat?.value ?? "—"}
                </p>
              )}
            </div>
          </div>

          {/* Right */}
          {!isEmpty && stat && <StatBadge value={stat.change} />}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Component ─────────────────────────────────────────────────────────────
const StatsCards = () => {
  const isEmpty = Object.keys(statsData).length === 0;

  return (
    <div
      className="
        grid w-full grid-cols-1 gap-4
        sm:grid-cols-2
        xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,1fr)]
      "
    >
      {/* Left: aligns with Recent Orders */}
      <div className="grid min-w-0 grid-cols-2 gap-3">
        {STATS_CONFIG.slice(0, 2).map((config) => (
          <StatCard
            key={config.key}
            config={config}
            stat={statsData[config.key]}
            isEmpty={isEmpty}
          />
        ))}
      </div>

      {/* Right: aligns with Sales Report */}
      <div className="grid min-w-0 grid-cols-2 gap-3">
        {STATS_CONFIG.slice(2, 4).map((config) => (
          <StatCard
            key={config.key}
            config={config}
            stat={statsData[config.key]}
            isEmpty={isEmpty}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsCards;