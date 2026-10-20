import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight, ShieldAlert } from "lucide-react";

import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
  useSearchAuditLogsQuery,
  type AuditLog,
} from "@/features/audit/auditAPI";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatDateTime, formatNumber } from "@/lib/format-display";
import { parseError } from "@/lib/parse-error";

const ALL = "__all";
const PAGE_SIZE = 25;

/** Pretty-prints the stored JSON change set; falls back to the raw text. */
const Changes = ({ log }: { log: AuditLog }) => {
  if (!log.changes) {
    return <p className="text-sm text-muted-foreground">No change details recorded.</p>;
  }

  let parsed: unknown = log.changes;
  try {
    parsed = JSON.parse(log.changes);
  } catch {
    // keep raw
  }

  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    return (
      <dl className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-[max-content_1fr]">
        {Object.entries(parsed as Record<string, unknown>).map(([key, value]) => (
          <Fragment key={key}>
            <dt className="text-muted-foreground">{key}</dt>
            <dd className="break-all font-mono text-xs">
              {typeof value === "object" ? JSON.stringify(value) : String(value ?? "—")}
            </dd>
          </Fragment>
        ))}
      </dl>
    );
  }

  return <pre className="whitespace-pre-wrap break-all font-mono text-xs">{String(parsed)}</pre>;
};

const AuditLogs = () => {
  const [entityType, setEntityType] = useState(ALL);
  const [entityId, setEntityId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);

  const debouncedEntityId = useDebouncedValue(entityId, 350);

  const { data, isFetching, isError, error } = useSearchAuditLogsQuery({
    entityType: entityType === ALL ? undefined : Number(entityType),
    entityId: debouncedEntityId.trim() || undefined,
    from: from ? new Date(`${from}T00:00:00`).toISOString() : undefined,
    to: to ? new Date(`${to}T23:59:59`).toISOString() : undefined,
    pageIndex: page,
    pageSize: PAGE_SIZE,
  });

  const logs = data?.data ?? [];
  const total = Number(data?.count ?? 0);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const forbidden =
    isError && typeof error === "object" && error && "status" in error && error.status === 403;

  const resetPage = () => {
    setPage(0);
    setExpanded(null);
  };

  return (
    <PageLayout
      title="Audit Logs"
      subtitle="Who changed what, and when. Entries can't be edited or deleted."
    >
      <div className="mx-auto mt-4 w-full max-w-[1600px] space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Record type</Label>
            <Select
              value={entityType}
              onValueChange={(value) => {
                setEntityType(value);
                resetPage();
              }}
            >
              <SelectTrigger className="w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All types</SelectItem>
                {Object.entries(AUDIT_ENTITY_TYPES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="audit-entity" className="text-xs">Record ID</Label>
            <Input
              id="audit-entity"
              placeholder="Exact id"
              value={entityId}
              onChange={(e) => {
                setEntityId(e.target.value);
                resetPage();
              }}
              className="w-72 font-mono text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="audit-from" className="text-xs">From</Label>
            <Input
              id="audit-from"
              type="date"
              value={from}
              max={to || undefined}
              onChange={(e) => {
                setFrom(e.target.value);
                resetPage();
              }}
              className="w-40"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="audit-to" className="text-xs">To</Label>
            <Input
              id="audit-to"
              type="date"
              value={to}
              min={from || undefined}
              onChange={(e) => {
                setTo(e.target.value);
                resetPage();
              }}
              className="w-40"
            />
          </div>
        </div>

        <Card className="overflow-hidden !py-0">
          {forbidden ? (
            <EmptyState
              icon={ShieldAlert}
              title="You don't have access to audit logs"
              description="Viewing audit logs needs the Audit.View permission. Ask an administrator to add it to one of your roles."
            />
          ) : isError ? (
            <p className="py-10 text-center text-sm text-destructive">{parseError(error)}</p>
          ) : isFetching && !data ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 8 }, (_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <EmptyState title="No audit entries" description="Nothing matches these filters." />
          ) : (
            <Table className={isFetching ? "opacity-60" : undefined}>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>When</TableHead>
                  <TableHead>Who</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Record</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => {
                  const open = expanded === log.id;
                  return (
                    <Fragment key={log.id}>
                      <TableRow
                        className="cursor-pointer"
                        onClick={() => setExpanded(open ? null : log.id)}
                      >
                        <TableCell>
                          {open ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {formatDateTime(log.occurredAt)}
                        </TableCell>
                        <TableCell className="font-medium">{log.performedByUserName || "System"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{AUDIT_ACTIONS[log.action] ?? log.action}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">
                            {AUDIT_ENTITY_TYPES[log.entityType] ?? log.entityType}
                          </span>{" "}
                          <span className="font-medium">{log.entityDisplayName || log.entityId}</span>
                        </TableCell>
                      </TableRow>
                      {open && (
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableCell />
                          <TableCell colSpan={4} className="space-y-2 py-3">
                            <p className="font-mono text-[11px] text-muted-foreground">
                              id {log.entityId}
                            </p>
                            <Changes log={log} />
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>

        {total > PAGE_SIZE && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {formatNumber(total)} entries · page {page + 1} of {pageCount}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => {
                  setPage((p) => p - 1);
                  setExpanded(null);
                }}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pageCount - 1}
                onClick={() => {
                  setPage((p) => p + 1);
                  setExpanded(null);
                }}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default AuditLogs;
