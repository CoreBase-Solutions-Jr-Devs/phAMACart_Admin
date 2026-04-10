import { OverviewChart } from "./_component/overview-chart";
import RecentOrders from "./_component/recent-orders";
import StatsCards from "./_component/stats-cards";
import QuickActions from "./_component/quick-actions";

// ── Component ────────────────────────────────────────────────────────────────
const Overview = () => {
  return (
    <div className="space-y-6 pt-5 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Greeting */}
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-lg sm:text-xl">
            Hello, John 👋
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Here’s what’s happening in your store today.
          </p>
        </div>

        {/* Quick Actions (right side) */}
        <QuickActions />
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Main Content */}
      <div className="flex flex-col gap-6">
        <OverviewChart />
        <RecentOrders />
      </div>
    </div>
  );
};

export default Overview;