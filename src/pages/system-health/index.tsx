import { AlertTriangle, CheckCircle2, RefreshCw, XCircle } from "lucide-react";

import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetHealthDetailsQuery, type HealthCheckEntry } from "@/features/system/healthAPI";
import { humanize } from "@/lib/format-display";
import { parseError } from "@/lib/parse-error";
import { cn } from "@/lib/utils";

const STATUS = {
  Healthy: { icon: CheckCircle2, className: "text-green-600", badge: "bg-green-500/10 text-green-700 dark:text-green-400" },
  Degraded: { icon: AlertTriangle, className: "text-amber-500", badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  Unhealthy: { icon: XCircle, className: "text-destructive", badge: "bg-red-500/10 text-red-700 dark:text-red-400" },
} as const;

const statusOf = (s: string) => STATUS[s as keyof typeof STATUS] ?? STATUS.Degraded;

const formatData = (value: unknown) =>
  value === null || value === undefined
    ? "—"
    : typeof value === "object"
      ? JSON.stringify(value)
      : String(value);

const CheckCard = ({ check }: { check: HealthCheckEntry }) => {
  const { icon: Icon, className, badge } = statusOf(check.status);
  const data = Object.entries(check.data ?? {});

  return (
    <Card className="gap-3 py-4">
      <CardHeader className="flex flex-row items-start justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Icon className={cn("size-4 shrink-0", className)} />
          <CardTitle className="truncate text-sm">{humanize(check.name.replace(/[-_.]/g, " "))}</CardTitle>
        </div>
        <Badge variant="secondary" className={badge}>
          {check.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2 px-4">
        {check.description && <p className="text-sm text-muted-foreground">{check.description}</p>}
        {data.length > 0 && (
          <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-xs">
            {data.map(([key, value]) => (
              <div key={key} className="contents">
                <dt className="text-muted-foreground">{key}</dt>
                <dd className="break-all font-mono">{formatData(value)}</dd>
              </div>
            ))}
          </dl>
        )}
        <p className="text-[11px] text-muted-foreground">{check.durationMs} ms</p>
      </CardContent>
    </Card>
  );
};

const SystemHealth = () => {
  const { data, isFetching, isError, error, refetch, fulfilledTimeStamp } = useGetHealthDetailsQuery(
    undefined,
    { pollingInterval: 60_000 },
  );

  const overall = data ? statusOf(data.status) : null;
  const OverallIcon = overall?.icon;

  return (
    <PageLayout
      title="System Health"
      subtitle="Databases, cache, background worker and payment signals. Refreshes every minute."
      rightAction={
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={cn("size-4", isFetching && "animate-spin")} />
          Check now
        </Button>
      }
    >
      <div className="mx-auto mt-4 w-full max-w-[1600px] space-y-4">
        {isError ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-destructive">{parseError(error)}</CardContent>
          </Card>
        ) : !data ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-36 w-full" />
            ))}
          </div>
        ) : (
          <>
            <Card className="py-4">
              <CardContent className="flex flex-wrap items-center gap-3 px-4">
                {OverallIcon && <OverallIcon className={cn("size-6", overall?.className)} />}
                <div>
                  <p className="font-semibold">
                    {data.status === "Healthy"
                      ? "All systems healthy"
                      : data.status === "Degraded"
                        ? "Running, with warnings"
                        : "Something is down"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {data.checks.length} checks in {data.durationMs} ms
                    {fulfilledTimeStamp
                      ? ` · checked ${new Date(fulfilledTimeStamp).toLocaleTimeString()}`
                      : ""}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[...data.checks]
                .sort((a, b) => {
                  const rank = (s: string) => (s === "Unhealthy" ? 0 : s === "Degraded" ? 1 : 2);
                  return rank(a.status) - rank(b.status) || a.name.localeCompare(b.name);
                })
                .map((check) => (
                  <CheckCard key={check.name} check={check} />
                ))}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default SystemHealth;
