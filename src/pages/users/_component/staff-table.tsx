import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { LogOut, ShieldMinus, ShieldPlus } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  useDemoteUserMutation,
  useGetStaffQuery,
  useRevokeAllUserSessionsMutation,
} from "@/features/users/usersAPI";
import { StaffMember } from "@/features/users/usersType";
import usePermissions from "@/hooks/use-permissions";
import { PERMISSIONS, canGrantRole, isStaffRole } from "@/lib/permissions";
import { parseError } from "@/lib/parse-error";
import { formatDateTime } from "./session-format";
import { PromoteUserDialog } from "./promote-user-dialog";

const displayName = (m: StaffMember) =>
  `${m.firstName ?? ""} ${m.lastName ?? ""}`.trim() || m.userName || m.email || m.userId;

/** Users on this pharmacy's company profile staff list. */
const StaffTable = () => {
  const { data = [], isFetching } = useGetStaffQuery();
  const { can, roles: myRoles } = usePermissions();
  const [demote, { isLoading: isDemoting }] = useDemoteUserMutation();
  const [revokeAll] = useRevokeAllUserSessionsMutation();

  const [promoteTarget, setPromoteTarget] = useState<StaffMember | null>(null);
  const [demoteTarget, setDemoteTarget] = useState<StaffMember | null>(null);

  const canPromote = can(PERMISSIONS.USERS_PROMOTE);
  const canRevoke = can(PERMISSIONS.SESSIONS_REVOKE);

  const canChange = (m: StaffMember) =>
    canPromote && m.roles.filter(isStaffRole).every((r) => canGrantRole(myRoles, r));

  const handleDemote = async () => {
    if (!demoteTarget) return;
    try {
      await demote(demoteTarget.userId).unwrap();
      toast.success(`${displayName(demoteTarget)} is no longer staff.`);
      setDemoteTarget(null);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  const handleRevokeAll = async (m: StaffMember) => {
    try {
      const res = await revokeAll(m.userId).unwrap();
      toast.success(`Signed ${displayName(m)} out of ${res.revoked} session(s).`);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  const columns: ColumnDef<StaffMember>[] = [
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{displayName(row.original)}</p>
          <p className="text-xs text-muted-foreground">{row.original.email ?? "—"}</p>
        </div>
      ),
    },
    {
      id: "staffRole",
      header: "Staff role",
      cell: ({ row }) => <Badge>{row.original.staffRole}</Badge>,
    },
    {
      id: "roles",
      header: "All roles",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.roles.map((r) => (
            <Badge key={r} variant="secondary">
              {r}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: "lastSignedIn",
      header: "Last signed in",
      cell: ({ row }) => (
        <span className="text-sm">{formatDateTime(row.original.lastSignedInAt)}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) =>
        row.original.isLockedOut ? (
          <Badge variant="destructive">Locked</Badge>
        ) : (
          <Badge variant="outline">OK</Badge>
        ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const m = row.original;
        const changeable = canChange(m);
        return (
          <div className="flex items-center gap-2">
            {changeable && (
              <Button size="sm" variant="outline" onClick={() => setPromoteTarget(m)} title="Change role">
                <ShieldPlus size={16} />
              </Button>
            )}
            {changeable && (
              <Button size="sm" variant="outline" onClick={() => setDemoteTarget(m)} title="Remove from staff">
                <ShieldMinus size={16} />
              </Button>
            )}
            {canRevoke && (
              <Button size="sm" variant="outline" onClick={() => handleRevokeAll(m)} title="Sign out everywhere">
                <LogOut size={16} />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        People listed on this pharmacy&apos;s company profile. Promote customers from the Users tab.
      </p>

      <DataTable
        data={data}
        columns={columns}
        isLoading={isFetching}
        selection={false}
        showSearch={false}
        emptyTitle="No staff yet"
        isShowPagination={false}
      />

      <PromoteUserDialog
        user={
          promoteTarget
            ? { id: promoteTarget.userId, name: displayName(promoteTarget), roles: promoteTarget.roles }
            : null
        }
        onOpenChange={(open) => !open && setPromoteTarget(null)}
      />

      <Dialog open={!!demoteTarget} onOpenChange={(open) => !open && setDemoteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove from staff</DialogTitle>
            <DialogDescription>
              {demoteTarget && displayName(demoteTarget)} loses every staff role, is removed from the
              company profile and is signed out. Their customer account stays.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDemoteTarget(null)} disabled={isDemoting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDemote} disabled={isDemoting}>
              {isDemoting ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffTable;
