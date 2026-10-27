import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  LockOpen,
  LogOut,
  MoreHorizontal,
  Power,
  PowerOff,
  ShieldMinus,
  ShieldPlus,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { User } from "@/features/users/usersType";
import { isStaffRole } from "@/lib/permissions";

interface UserColumnOptions {
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (user: User) => void;
  onUnlock: (user: User) => void;
  onPromote: (user: User) => void;
  onDemote: (user: User) => void;
  onSignOutEverywhere: (user: User) => void;
  /** What the signed-in admin may do (from their permissions). */
  allowed: {
    manage: boolean;
    remove: boolean;
    promote: boolean;
    revokeSessions: boolean;
    /** Whether the admin may change this particular user's staff roles. */
    canChangeStaff: (user: User) => boolean;
  };
}

export const userColumns = ({
  onEdit,
  onDelete,
  onToggleStatus,
  onUnlock,
  onPromote,
  onDemote,
  onSignOutEverywhere,
  allowed,
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
    cell: ({ row }) => {
      const user = row.original;
      const isStaff = (user.roles ?? []).some(isStaffRole);
      const canChangeStaff = allowed.promote && allowed.canChangeStaff(user);
      const hasMenu = allowed.manage || allowed.remove || canChangeStaff || allowed.revokeSessions;

      return (
        <div className="flex items-center gap-2">
          {allowed.manage && (
            <Button size="sm" variant="outline" onClick={() => onEdit(user)}>
              <Edit size={16} />
            </Button>
          )}

          {hasMenu && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" aria-label="More actions">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {canChangeStaff && (
                  <DropdownMenuItem onSelect={() => onPromote(user)}>
                    <ShieldPlus size={14} /> {isStaff ? "Change staff role" : "Promote to staff"}
                  </DropdownMenuItem>
                )}

                {canChangeStaff && isStaff && (
                  <DropdownMenuItem onSelect={() => onDemote(user)}>
                    <ShieldMinus size={14} /> Remove from staff
                  </DropdownMenuItem>
                )}

                {allowed.revokeSessions && (
                  <DropdownMenuItem onSelect={() => onSignOutEverywhere(user)}>
                    <LogOut size={14} /> Sign out everywhere
                  </DropdownMenuItem>
                )}

                {allowed.manage && (
                  <DropdownMenuItem onSelect={() => onToggleStatus(user)}>
                    {user.isActive ? (
                      <>
                        <PowerOff size={14} /> Deactivate
                      </>
                    ) : (
                      <>
                        <Power size={14} /> Reactivate
                      </>
                    )}
                  </DropdownMenuItem>
                )}

                {allowed.manage && (
                  <DropdownMenuItem onSelect={() => onUnlock(user)}>
                    <LockOpen size={14} /> Unlock sign-in
                  </DropdownMenuItem>
                )}

                {allowed.remove && (
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={() => onDelete(user.id)}
                  >
                    <Trash2 size={14} /> Delete permanently
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      );
    },
  },
];