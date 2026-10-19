import {
  Plus,
  Trash2,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import type { CompanyProfileUser } from "@/features/tenantOnboarding/tenantOnboardingType";

interface UsersSectionProps {
  users: CompanyProfileUser[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (
    index: number,
    key: keyof CompanyProfileUser,
    value: string,
  ) => void;
}

export function UsersSection({
  users,
  onAdd,
  onRemove,
  onUpdate,
}: UsersSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="size-5" />
              Initial Users
            </CardTitle>

            <CardDescription>
              Users to associate with the newly
              provisioned company profile.
            </CardDescription>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onAdd}
          >
            <Plus className="size-4" />
            Add user
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {users.length === 0 && (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No initial users added.
          </p>
        )}

        {users.map((user, index) => (
          <div
            key={`${user.userId}-${index}`}
            className="grid grid-cols-1 gap-3 rounded-lg border p-4 md:grid-cols-[1fr_200px_auto]"
          >
            <Input
              placeholder="User ID"
              value={user.userId}
              onChange={(event) =>
                onUpdate(
                  index,
                  "userId",
                  event.target.value,
                )
              }
            />

            <Input
              placeholder="Role"
              value={user.role}
              onChange={(event) =>
                onUpdate(
                  index,
                  "role",
                  event.target.value,
                )
              }
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
              aria-label="Remove user"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}