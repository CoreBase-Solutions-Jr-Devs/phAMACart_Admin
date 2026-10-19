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
} from "@/features/users/usersAPI";

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
    totalCount,
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
     COLUMNS
  ========================= */

  const columns = userColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
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

        <CreateUserFormDialog
          onUserCreated={handleUserCreated}
        >
          <Button className="pr-7!">
            <PlusIcon />
            Create User
          </Button>
        </CreateUserFormDialog>
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
              Are you sure you want to
              delete this user? This
              action cannot be undone.
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