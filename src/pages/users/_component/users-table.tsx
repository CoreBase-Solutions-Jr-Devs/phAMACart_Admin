import { useState } from "react";

import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

import {
  useSearchUsersQuery,
  useDeleteUserMutation,
  useSetUserStatusMutation,
  useUnlockUserMutation,
  useDemoteUserMutation,
  useRevokeAllUserSessionsMutation,
} from "@/features/users/usersAPI";
import usePermissions from "@/hooks/use-permissions";
import { PERMISSIONS, canGrantRole, isStaffRole } from "@/lib/permissions";
import { PromoteUserDialog } from "./promote-user-dialog";

import { User } from "@/features/users/usersType";
import { parseError } from "@/lib/parse-error";

import { userColumns } from "./columns";
import { UserFormDialog } from "./user-form-dialog";
import { CreateUserFormDialog } from "./create-user-form-dialog";

const UsersTable = () => {
  const [filter, setFilter] = useState({
    searchTerm: "",
    pageIndex: 0,
    pageSize: 20,
  });

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] =
    useState(false);

  const [pendingDeleteId, setPendingDeleteId] =
    useState<string | null>(null);

  /* =========================
     DATA
  ========================= */

  const { data, isFetching } =
    useSearchUsersQuery({
      searchTerm:
        filter.searchTerm || undefined,
      pageIndex: filter.pageIndex,
      pageSize: filter.pageSize,
    });

  const [
    deleteUserMutation,
    { isLoading: isDeleting },
  ] = useDeleteUserMutation();

  const users = data?.users?.data ?? [];

  /* =========================
     PAGINATION
  ========================= */

  const totalCount =
    data?.users?.count ?? 0;

  const pagination = {
    totalItems: totalCount,
    totalPages: Math.ceil(
      totalCount / filter.pageSize
    ),
    pageNumber:
      filter.pageIndex + 1,
    pageSize:
      filter.pageSize,
  };

  const handlePageChange = (
    pageNumber: number
  ) => {
    setFilter((prev) => ({
      ...prev,
      pageIndex: pageNumber - 1,
    }));
  };

  const handlePageSizeChange = (
    pageSize: number
  ) => {
    setFilter((prev) => ({
      ...prev,
      pageSize,
      pageIndex: 0,
    }));
  };

  /* =========================
     EDIT
  ========================= */

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  /* =========================
     USER CREATED
  ========================= */

  const handleUserCreated = (user: User) => {
    /*
     * Select the newly created user.
     */
    setSelectedUser(user);

    /*
     * Immediately open the edit dialog.
     */
    setIsEditDialogOpen(true);
  };

  /* =========================
     EDIT DIALOG
  ========================= */

  const handleEditDialogChange = (
    open: boolean
  ) => {
    setIsEditDialogOpen(open);

    if (!open) {
      setSelectedUser(null);
    }
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) {
      return;
    }

    try {
      await deleteUserMutation(
        pendingDeleteId
      ).unwrap();

      toast.success(
        "User deleted successfully."
      );

      setPendingDeleteId(null);
    } catch (err) {
      toast.error(parseError(err));
      setPendingDeleteId(null);
    }
  };

  /* =========================
     STATUS / UNLOCK
  ========================= */

  const [setUserStatus] = useSetUserStatusMutation();
  const [unlockUser] = useUnlockUserMutation();

  const handleToggleStatus = async (user: User) => {
    try {
      await setUserStatus({
        id: user.id,
        reactivate: !user.isActive,
      }).unwrap();

      toast.success(
        user.isActive
          ? `${user.userName} deactivated. They can no longer sign in.`
          : `${user.userName} reactivated.`
      );
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  const handleUnlock = async (user: User) => {
    try {
      await unlockUser(user.id).unwrap();
      toast.success(`${user.userName} unlocked.`);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  /* =========================
     STAFF / SESSIONS
  ========================= */

  const { can, roles: myRoles } = usePermissions();
  const [promoteTarget, setPromoteTarget] = useState<User | null>(null);
  const [demoteUser] = useDemoteUserMutation();
  const [revokeAll] = useRevokeAllUserSessionsMutation();

  const handleDemote = async (user: User) => {
    try {
      await demoteUser(user.id).unwrap();
      toast.success(`${user.userName} is no longer staff and has been signed out.`);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  const handleSignOutEverywhere = async (user: User) => {
    try {
      const res = await revokeAll(user.id).unwrap();
      toast.success(`Signed ${user.userName} out of ${res.revoked} session(s).`);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  /* =========================
     COLUMNS
  ========================= */

  const columns = userColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onToggleStatus: handleToggleStatus,
    onUnlock: handleUnlock,
    onPromote: setPromoteTarget,
    onDemote: handleDemote,
    onSignOutEverywhere: handleSignOutEverywhere,
    allowed: {
      manage: can(PERMISSIONS.USERS_MANAGE),
      remove: can(PERMISSIONS.USERS_DELETE),
      promote: can(PERMISSIONS.USERS_PROMOTE),
      revokeSessions: can(PERMISSIONS.SESSIONS_REVOKE),
      canChangeStaff: (user) =>
        (user.roles ?? []).filter(isStaffRole).every((r) => canGrantRole(myRoles, r)),
    },
  });

  return (
    <div className="space-y-4">
      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search users..."
          value={filter.searchTerm}
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              searchTerm: e.target.value,
              pageIndex: 0,
            }))
          }
          className="max-w-sm"
        />

        {can(PERMISSIONS.USERS_MANAGE) && (
          <CreateUserFormDialog
            onUserCreated={handleUserCreated}
          >
            <Button className="pr-7!">
              <PlusIcon />
              Create User
            </Button>
          </CreateUserFormDialog>
        )}
      </div>

      {/* =========================
          TABLE
      ========================= */}

      <DataTable
        data={users}
        columns={columns}
        isLoading={isFetching}
        selection={false}
        showSearch={false}
        emptyTitle="No users found"
        isShowPagination={true}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* =========================
          EDIT USER
      ========================= */}

      <UserFormDialog
        user={selectedUser ?? undefined}
        open={isEditDialogOpen}
        onOpenChange={handleEditDialogChange}
      />

      {/* =========================
          PROMOTE TO STAFF
      ========================= */}

      <PromoteUserDialog
        user={
          promoteTarget
            ? {
                id: promoteTarget.id,
                name: promoteTarget.userName,
                roles: promoteTarget.roles ?? [],
              }
            : null
        }
        onOpenChange={(open) => !open && setPromoteTarget(null)}
      />

      {/* =========================
          DELETE CONFIRMATION
      ========================= */}

      <Dialog
        open={!!pendingDeleteId}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDeleteId(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete User
            </DialogTitle>

            <DialogDescription>
              This permanently removes the
              account and signs it out. Order
              and prescription history is kept.
              To block access temporarily, use
              Deactivate instead.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setPendingDeleteId(null)
              }
              disabled={isDeleting}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting
                ? "Deleting..."
                : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersTable;