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
import { Skeleton } from "@/components/ui/skeleton";
import { useOverviewStats, type OverviewStat } from "@/hooks/use-overview-stats";
import { formatKES, formatKESCompact, formatNumber } from "@/lib/format-display";

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
    label: "PAID ORDERS",
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

// ── Badge ─────────────────────────────────────────────────────────────────
function StatBadge({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <span className="shrink-0 text-[10px] text-muted-foreground">
        new
      </span>
    );
  }

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
      <span className="text-muted-foreground">vs prior 30d</span>
    </span>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({
  config,
  stat,
  isEmpty,
  isLoading,
}: {
  config: (typeof STATS_CONFIG)[number];
  stat?: OverviewStat;
  isEmpty: boolean;
  isLoading: boolean;
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

              {isLoading ? (
                <Skeleton className="mt-1 h-5 w-16" />
              ) : isEmpty ? (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  No data yet
                </p>
              ) : (
                <p
                  className="mt-0.5 truncate text-lg font-semibold tracking-tight tabular-nums"
                  title={
                    stat && config.key === "revenue"
                      ? formatKES(stat.value)
                      : undefined
                  }
                >
                  {stat
                    ? config.key === "revenue"
                      ? formatKESCompact(stat.value)
                      : formatNumber(stat.value)
                    : "—"}
                </p>
              )}

              {!isEmpty && !isLoading && stat && (
                <div className="mt-0.5">
                  <StatBadge value={stat.change} />
                </div>
              )}
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}

// ── Component ─────────────────────────────────────────────────────────────
const StatsCards = () => {
  const { stats, hasData, isLoading } = useOverviewStats();
  const isEmpty = !hasData;

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
            stat={stats[config.key]}
            isEmpty={isEmpty}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Right: aligns with Sales Report */}
      <div className="grid min-w-0 grid-cols-2 gap-3">
        {STATS_CONFIG.slice(2, 4).map((config) => (
          <StatCard
            key={config.key}
            config={config}
            stat={stats[config.key]}
            isEmpty={isEmpty}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsCards;