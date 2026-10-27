import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ShieldPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useGetRolesQuery, usePromoteUserMutation } from "@/features/users/usersAPI";
import usePermissions from "@/hooks/use-permissions";
import { canGrantRole, isStaffRole } from "@/lib/permissions";
import { parseError } from "@/lib/parse-error";

type PromoteTarget = {
  id: string;
  name: string;
  roles: string[];
};

interface PromoteUserDialogProps {
  user: PromoteTarget | null;
  onOpenChange: (open: boolean) => void;
}

/** Make a user company staff with a chosen role (feature #1). */
export const PromoteUserDialog = ({ user, onOpenChange }: PromoteUserDialogProps) => {
  const { roles: myRoles } = usePermissions();
  const [role, setRole] = useState("");

  const { data: rolesData, isFetching } = useGetRolesQuery(
    { isActive: true, pageSize: 100 },
    { skip: !user },
  );

  const [promote, { isLoading }] = usePromoteUserMutation();

  const options = useMemo(
    () =>
      (rolesData?.data ?? [])
        .map((r) => r.name)
        .filter((name) => isStaffRole(name) && canGrantRole(myRoles, name)),
    [rolesData, myRoles],
  );

  const currentStaffRole = user?.roles.find(isStaffRole);

  const handleSubmit = async () => {
    if (!user || !role) return;

    try {
      await promote({ id: user.id, role }).unwrap();
      toast.success(`${user.name} is now ${role}. They'll need to sign in again.`);
      setRole("");
      onOpenChange(false);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  return (
    <Dialog
      open={!!user}
      onOpenChange={(open) => {
        if (!open) setRole("");
        onOpenChange(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{currentStaffRole ? "Change staff role" : "Promote to staff"}</DialogTitle>
          <DialogDescription>
            {user?.name} will be added to this pharmacy&apos;s staff list with the role you pick,
            and signed out of every device so the new role applies.
            {currentStaffRole && ` Current role: ${currentStaffRole}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="promote-role">Role</Label>
          <Select value={role} onValueChange={setRole} disabled={isFetching}>
            <SelectTrigger id="promote-role" className="w-full">
              <SelectValue placeholder={isFetching ? "Loading roles..." : "Choose a role"} />
            </SelectTrigger>
            <SelectContent>
              {options.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!isFetching && options.length === 0 && (
            <p className="text-xs text-muted-foreground">There are no roles you can give.</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!role || isLoading}>
            <ShieldPlus size={16} />
            {isLoading ? "Saving..." : "Promote"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
