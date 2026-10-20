import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateRoleMutation,
  useGetPermissionsQuery,
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
} from "@/features/identity/accessAPI";
import { PERMISSION_MODULES } from "@/features/identity/accessType";
import { parseError } from "@/lib/parse-error";

interface Props {
  /** null = closed, "new" = create, otherwise the role id to edit/view. */
  roleId: string | null;
  onOpenChange: (open: boolean) => void;
}

export const RoleDialog = ({ roleId, onOpenChange }: Props) => {
  const isNew = roleId === "new";
  const open = roleId !== null;

  const { data: role, isFetching: roleLoading } = useGetRoleByIdQuery(roleId ?? "", {
    skip: !open || isNew,
  });
  const { data: permissions, isLoading: permissionsLoading } = useGetPermissionsQuery(
    undefined,
    { skip: !open },
  );

  const [createRole, { isLoading: creating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: updating }] = useUpdateRoleMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const readOnly = !!role?.isSystemRole;

  useEffect(() => {
    if (!open) return;

    if (isNew) {
      setName("");
      setDescription("");
      setSelected(new Set());
    } else if (role) {
      setName(role.name);
      setDescription(role.description ?? "");
      setSelected(new Set(role.permissionIds));
    }
  }, [open, isNew, role]);

  const groups = useMemo(
    () =>
      [...(permissions?.data ?? [])].sort((a, b) =>
        (PERMISSION_MODULES[a.module] ?? "").localeCompare(PERMISSION_MODULES[b.module] ?? ""),
      ),
    [permissions],
  );

  const toggle = (id: string, checked: boolean) =>
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });

  const toggleModule = (ids: string[], checked: boolean) =>
    setSelected((current) => {
      const next = new Set(current);
      ids.forEach((id) => (checked ? next.add(id) : next.delete(id)));
      return next;
    });

  const save = async () => {
    if (!name.trim()) {
      toast.error("Role name is required.");
      return;
    }

    const body = {
      name: name.trim(),
      description: description.trim() || null,
      permissionIds: [...selected],
    };

    try {
      if (isNew) {
        await createRole(body).unwrap();
        toast.success(`Role "${body.name}" created.`);
      } else if (roleId) {
        await updateRole({ roleId, body }).unwrap();
        toast.success(`Role "${body.name}" updated. Users with it must sign in again to pick up changes.`);
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  const busy = creating || updating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isNew ? "New role" : readOnly ? `${role?.name ?? "Role"} (system role)` : "Edit role"}
          </DialogTitle>
          <DialogDescription>
            {readOnly
              ? "System roles are managed by the platform and can't be changed."
              : "A role is a named set of permissions. Assign roles to users on the Users page."}
          </DialogDescription>
        </DialogHeader>

        {!isNew && roleLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="role-name">Name</Label>
                <Input
                  id="role-name"
                  value={name}
                  disabled={readOnly}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pharmacist"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="role-description">Description</Label>
                <Textarea
                  id="role-description"
                  value={description}
                  disabled={readOnly}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What people with this role do"
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <Label>Permissions</Label>
                <span className="text-xs text-muted-foreground">{selected.size} selected</span>
              </div>

              {permissionsLoading ? (
                <Skeleton className="h-40 w-full" />
              ) : groups.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No permissions defined yet. Add them on the Permissions tab.
                </p>
              ) : (
                <div className="divide-y rounded-md border">
                  {groups.map((group) => {
                    const ids = group.permissions.map((p) => p.id);
                    const chosen = ids.filter((id) => selected.has(id)).length;

                    return (
                      <div key={group.module} className="space-y-2 p-3">
                        <label className="flex items-center gap-2 text-sm font-medium">
                          <Checkbox
                            disabled={readOnly}
                            checked={chosen === ids.length}
                            onCheckedChange={(checked) => toggleModule(ids, checked === true)}
                          />
                          {PERMISSION_MODULES[group.module] ?? `Module ${group.module}`}
                          <span className="text-xs font-normal text-muted-foreground">
                            {chosen}/{ids.length}
                          </span>
                        </label>

                        <div className="grid gap-2 pl-6 sm:grid-cols-2">
                          {group.permissions.map((permission) => (
                            <label key={permission.id} className="flex items-start gap-2 text-sm">
                              <Checkbox
                                className="mt-0.5"
                                disabled={readOnly}
                                checked={selected.has(permission.id)}
                                onCheckedChange={(checked) => toggle(permission.id, checked === true)}
                              />
                              <span>
                                {permission.name}
                                <span className="block font-mono text-[11px] text-muted-foreground">
                                  {permission.code}
                                </span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
            {readOnly ? "Close" : "Cancel"}
          </Button>
          {!readOnly && (
            <Button onClick={save} disabled={busy || (!isNew && roleLoading)}>
              {busy ? "Saving…" : isNew ? "Create role" : "Save changes"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
