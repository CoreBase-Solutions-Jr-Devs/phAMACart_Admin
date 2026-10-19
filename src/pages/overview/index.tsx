import { OverviewChart } from "./_component/overview-chart";
import RecentOrders from "./_component/recent-orders";
import StatsCards from "./_component/stats-cards";
import { useTypedSelector } from "@/app/hook";

const Overview = () => {
  const { user } = useTypedSelector((state) => state.auth);

  return (
    <main className="w-full px-4 py-4 sm:px-5 lg:px-6">
      <div className="w-full space-y-4">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold tracking-tight sm:text-lg">
              Hello, {user?.unique_name} 👋
            </h1>

            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
              Here’s what’s happening in your store today.
            </p>
          </div>
        </header>

        {/* Stats */}
        <section className="w-full">
          <StatsCards />
        </section>

        {/* Dashboard */}
        <section
          className="
            grid w-full grid-cols-1 gap-4
            xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,1fr)]
          "
        >
          {/* Recent Orders */}
          <div className="min-w-0">
            <RecentOrders />
          </div>

          {/* Sales Report */}
          <div className="min-w-0">
            <OverviewChart />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Overview;