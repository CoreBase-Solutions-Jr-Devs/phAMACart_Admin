import { useMemo, useState } from "react";
import { Lock, Pencil, PlusIcon, Search } from "lucide-react";

import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/empty-state";
import {
  useGetPermissionsQuery,
  useGetRoleListQuery,
} from "@/features/identity/accessAPI";
import { PERMISSION_MODULES, type Permission } from "@/features/identity/accessType";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { RoleDialog } from "./_component/role-dialog";
import { PermissionDialog } from "./_component/permission-dialog";

const RolesTab = () => {
  const [search, setSearch] = useState("");
  const [openRoleId, setOpenRoleId] = useState<string | null>(null);
  const debounced = useDebouncedValue(search, 300);

  const { data, isFetching } = useGetRoleListQuery({ searchTerm: debounced, pageSize: 100 });
  const roles = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search roles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => setOpenRoleId("new")}>
          <PlusIcon className="size-4" />
          New role
        </Button>
      </div>

      <Card className="overflow-hidden !py-0">
        {isFetching && !data ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : roles.length === 0 ? (
          <EmptyState title="No roles found" description="Create a role to group permissions." />
        ) : (
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Users</TableHead>
                <TableHead className="text-right">Permissions</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium">
                      {role.name}
                      {role.isSystemRole && (
                        <Badge variant="secondary" className="gap-1 text-[11px]">
                          <Lock className="size-3" /> System
                        </Badge>
                      )}
                    </div>
                    {role.description && (
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{role.userCount}</TableCell>
                  <TableCell className="text-right tabular-nums">{role.permissionCount}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setOpenRoleId(role.id)}>
                      {role.isSystemRole ? "View" : (
                        <>
                          <Pencil className="size-3.5" /> Edit
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <RoleDialog roleId={openRoleId} onOpenChange={(open) => !open && setOpenRoleId(null)} />
    </div>
  );
};

const PermissionsTab = () => {
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<{ open: boolean; permission?: Permission | null }>({
    open: false,
  });
  const debounced = useDebouncedValue(search, 300);

  const { data, isFetching } = useGetPermissionsQuery({ searchTerm: debounced });

  const groups = useMemo(
    () =>
      [...(data?.data ?? [])].sort((a, b) =>
        (PERMISSION_MODULES[a.module] ?? "").localeCompare(PERMISSION_MODULES[b.module] ?? ""),
      ),
    [data],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search permissions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => setDialog({ open: true, permission: null })}>
          <PlusIcon className="size-4" />
          New permission
        </Button>
      </div>

      {isFetching && !data ? (
        <Skeleton className="h-60 w-full" />
      ) : groups.length === 0 ? (
        <Card>
          <EmptyState title="No permissions found" description="Try a different search." />
        </Card>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <Card key={group.module} className="overflow-hidden !py-0">
              <div className="border-b bg-muted/60 px-4 py-2.5 text-sm font-semibold">
                {PERMISSION_MODULES[group.module] ?? `Module ${group.module}`}
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  {group.permissions.length}
                </span>
              </div>
              <Table>
                <TableBody>
                  {group.permissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="w-56 font-mono text-xs">
                        {PERMISSION_MODULES[group.module]?.replace(/[^A-Za-z]/g, "") ?? group.module}.
                        {permission.code}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{permission.name}</p>
                        {permission.description && (
                          <p className="text-xs text-muted-foreground">{permission.description}</p>
                        )}
                      </TableCell>
                      <TableCell className="w-28 text-right">
                        {permission.isSystemPermission ? (
                          <Badge variant="secondary" className="gap-1 text-[11px]">
                            <Lock className="size-3" /> System
                          </Badge>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDialog({ open: true, permission })}
                          >
                            <Pencil className="size-3.5" /> Edit
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ))}
        </div>
      )}

      <PermissionDialog
        open={dialog.open}
        permission={dialog.permission}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
      />
    </div>
  );
};

const AccessControl = () => (
  <PageLayout
    title="Roles & Permissions"
    subtitle="Define what each staff role can do. System roles and permissions are read-only."
  >
    <div className="mx-auto mt-4 w-full max-w-[1600px]">
      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>
        <TabsContent value="roles">
          <RolesTab />
        </TabsContent>
        <TabsContent value="permissions">
          <PermissionsTab />
        </TabsContent>
      </Tabs>
    </div>
  </PageLayout>
);

export default AccessControl;
