import { Link } from "react-router-dom";
import { ServerCog } from "lucide-react";

import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/empty-state";
import { useTypedSelector } from "@/app/hook";
import { useGetTenantsQuery } from "@/features/tenants/tenantsAPI";
import { parseError } from "@/lib/parse-error";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";

/** Dev/Support: every active tenant on the platform. */
const Tenants = () => {
  const current = useTypedSelector((state) => state.tenant.currentTenant);
  const { data, isFetching, isError, error } = useGetTenantsQuery({ pageIndex: 0, pageSize: 100 });
  const tenants = data?.data ?? [];

  return (
    <PageLayout
      title="Tenants"
      subtitle="Every pharmacy running on this platform."
      rightAction={
        <Button asChild>
          <Link to={PROTECTED_ROUTES.TENANTPROVISION}>
            <ServerCog className="size-4" />
            Provision tenant
          </Link>
        </Button>
      }
    >
      <div className="mx-auto mt-4 w-full max-w-[1600px]">
        <Card className="overflow-hidden !py-0">
          {isError ? (
            <p className="py-10 text-center text-sm text-destructive">{parseError(error)}</p>
          ) : isFetching && !data ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : tenants.length === 0 ? (
            <EmptyState title="No tenants yet" description="Provision the first pharmacy to get started." />
          ) : (
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Storefront host</TableHead>
                  <TableHead>Admin host</TableHead>
                  <TableHead>phAMACore URL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium">
                        {tenant.displayName}
                        {tenant.id === current?.id && (
                          <Badge variant="secondary" className="text-[11px]">This console</Badge>
                        )}
                      </div>
                      <p className="font-mono text-xs text-muted-foreground">{tenant.slug}</p>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{tenant.clientHost || "—"}</TableCell>
                    <TableCell className="font-mono text-xs">{tenant.adminHost || "—"}</TableCell>
                    <TableCell className="max-w-xs truncate font-mono text-xs">
                      {tenant.thirdPartyBaseUrl || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </PageLayout>
  );
};

export default Tenants;
