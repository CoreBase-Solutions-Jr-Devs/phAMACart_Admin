import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  LockOpen,
  MoreHorizontal,
  Power,
  PowerOff,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { User } from "@/features/users/usersType";

interface UserColumnOptions {
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (user: User) => void;
  onUnlock: (user: User) => void;
}

export const userColumns = ({
  onEdit,
  onDelete,
  onToggleStatus,
  onUnlock,
}: UserColumnOptions): ColumnDef<User>[] => [
  /* =========================
     NAME
  ========================= */
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original;

      const fullName = `${user.firstName ?? ""} ${
        user.lastName ?? ""
      }`.trim();

      return (
        <div>
          <p className="font-medium">
            {fullName || "—"}
          </p>

          <p className="text-xs text-muted-foreground">
            @{user.userName}
          </p>
        </div>
      );
    },
  },

  /* =========================
     EMAIL
  ========================= */
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.email || "—"}
      </span>
    ),
  },

  /* =========================
     PHONE
  ========================= */
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.phoneNumber || "—"}
      </span>
    ),
  },

  /* =========================
     ROLES
  ========================= */
  {
    id: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const roles = row.original.roles ?? [];

      if (!roles.length) {
        return (
          <span className="text-sm text-muted-foreground">
            No roles
          </span>
        );
      }

      return (
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => (
            <Badge key={role} variant="secondary">
              {role}
            </Badge>
          ))}
        </div>
      );
    },
  },

  /* =========================
     STATUS
  ========================= */
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.isActive;

      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },

  /* =========================
     DATE OF BIRTH
  ========================= */
  {
    accessorKey: "dateOfBirth",
    header: "Date of Birth",
    cell: ({ row }) => {
      const date = row.original.dateOfBirth;

      if (!date) {
        return "—";
      }

      return new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },

  /* =========================
     ACTIONS
  ========================= */
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(row.original)}
        >
          <Edit size={16} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" aria-label="More actions">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onToggleStatus(row.original)}>
              {row.original.isActive ? (
                <>
                  <PowerOff size={14} /> Deactivate
                </>
              ) : (
                <>
                  <Power size={14} /> Reactivate
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={() => onUnlock(row.original)}>
              <LockOpen size={14} /> Unlock sign-in
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={() => onDelete(row.original.id)}
            >
              <Trash2 size={14} /> Delete permanently
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];