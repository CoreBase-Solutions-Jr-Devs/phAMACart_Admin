import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
} from "@/features/identity/accessAPI";
import { PERMISSION_MODULES, type Permission } from "@/features/identity/accessType";
import { parseError } from "@/lib/parse-error";

interface Props {
  open: boolean;
  /** Set to edit; omit to create. */
  permission?: Permission | null;
  onOpenChange: (open: boolean) => void;
}

export const PermissionDialog = ({ open, permission, onOpenChange }: Props) => {
  const [module, setModule] = useState("4");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [createPermission, { isLoading: creating }] = useCreatePermissionMutation();
  const [updatePermission, { isLoading: updating }] = useUpdatePermissionMutation();

  useEffect(() => {
    if (!open) return;
    setModule(String(permission?.module ?? 4));
    setCode(permission?.code ?? "");
    setName(permission?.name ?? "");
    setDescription(permission?.description ?? "");
  }, [open, permission]);

  const save = async () => {
    if (!code.trim() || !name.trim()) {
      toast.error("Code and name are required.");
      return;
    }

    const body = {
      module: Number(module),
      code: code.trim(),
      name: name.trim(),
      description: description.trim() || null,
    };

    try {
      if (permission) {
        await updatePermission({ permissionId: permission.id, body }).unwrap();
        toast.success("Permission updated.");
      } else {
        await createPermission(body).unwrap();
        toast.success("Permission created.");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  const busy = creating || updating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{permission ? "Edit permission" : "New permission"}</DialogTitle>
          <DialogDescription>
            The policy name is <span className="font-mono">Module.Code</span>, e.g.{" "}
            <span className="font-mono">Audit.View</span>. Endpoints check it by that name.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Module</Label>
            <Select value={module} onValueChange={setModule}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PERMISSION_MODULES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="permission-code">Code</Label>
            <Input
              id="permission-code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\s+/g, ""))}
              placeholder="View"
              className="font-mono"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="permission-name">Name</Label>
            <Input
              id="permission-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="View audit logs"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="permission-description">Description</Label>
            <Textarea
              id="permission-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={save} disabled={busy}>
            {busy ? "Saving…" : permission ? "Save changes" : "Create permission"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
