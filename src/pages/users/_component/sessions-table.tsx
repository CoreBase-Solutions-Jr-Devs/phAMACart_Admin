import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { useRevokeSessionMutation, useSearchSessionsQuery } from "@/features/users/usersAPI";
import { UserSession } from "@/features/users/usersType";
import usePermissions from "@/hooks/use-permissions";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { PERMISSIONS } from "@/lib/permissions";
import { parseError } from "@/lib/parse-error";
import { describeDevice, formatDateTime } from "./session-format";

/** Where people are signed in, with a per-session sign-out (feature #5). */
const SessionsTable = () => {
  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(true);
  const [page, setPage] = useState({ pageIndex: 0, pageSize: 20 });
  const debouncedSearch = useDebouncedValue(search, 350);

  const { data, isFetching } = useSearchSessionsQuery({
    searchTerm: debouncedSearch || undefined,
    activeOnly,
    pageIndex: page.pageIndex,
    pageSize: page.pageSize,
  });

  const { can } = usePermissions();
  const canRevoke = can(PERMISSIONS.SESSIONS_REVOKE);
  const [revoke, { isLoading: isRevoking }] = useRevokeSessionMutation();

  const handleRevoke = async (s: UserSession) => {
    try {
      await revoke(s.id).unwrap();
      toast.success(`Signed ${s.userName ?? "the user"} out of ${describeDevice(s.device, s.userAgent)}.`);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  const columns: ColumnDef<UserSession>[] = [
    {
      id: "user",
      header: "User",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.fullName || row.original.userName || "—"}</p>
          <p className="text-xs text-muted-foreground">{row.original.email ?? ""}</p>
        </div>
      ),
    },
    {
      id: "device",
      header: "Device",
      cell: ({ row }) => (
        <div>
          <p className="text-sm">{describeDevice(row.original.device, row.original.userAgent)}</p>
          <p className="text-xs text-muted-foreground">{row.original.ipAddress ?? ""}</p>
        </div>
      ),
    },
    {
      id: "workspace",
      header: "App",
      cell: ({ row }) => <span className="text-sm">{row.original.workspace ?? "—"}</span>,
    },
    {
      id: "started",
      header: "Signed in",
      cell: ({ row }) => <span className="text-sm">{formatDateTime(row.original.createdAtUtc)}</span>,
    },
    {
      id: "expires",
      header: "Expires",
      cell: ({ row }) => <span className="text-sm">{formatDateTime(row.original.expiresAtUtc)}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) =>
        row.original.isActive ? (
          <Badge>Active</Badge>
        ) : row.original.isRevoked ? (
          <Badge variant="destructive">Signed out</Badge>
        ) : (
          <Badge variant="secondary">Expired</Badge>
        ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) =>
        canRevoke && row.original.isActive ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleRevoke(row.original)}
            disabled={isRevoking}
            title="Sign out this device"
          >
            <LogOut size={16} />
          </Button>
        ) : null,
    },
  ];

  const total = data?.count ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search by user, email, IP or device..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage((p) => ({ ...p, pageIndex: 0 }));
          }}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Switch
            id="active-only"
            checked={activeOnly}
            onCheckedChange={(v) => {
              setActiveOnly(v);
              setPage((p) => ({ ...p, pageIndex: 0 }));
            }}
          />
          <Label htmlFor="active-only">Active sessions only</Label>
        </div>
      </div>

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isFetching}
        selection={false}
        showSearch={false}
        emptyTitle={activeOnly ? "Nobody is signed in" : "No sessions found"}
        isShowPagination={true}
        pagination={{
          totalItems: total,
          totalPages: Math.ceil(total / page.pageSize),
          pageNumber: page.pageIndex + 1,
          pageSize: page.pageSize,
        }}
        onPageChange={(n) => setPage((p) => ({ ...p, pageIndex: n - 1 }))}
        onPageSizeChange={(size) => setPage({ pageIndex: 0, pageSize: size })}
      />
    </div>
  );
};

export default SessionsTable;
