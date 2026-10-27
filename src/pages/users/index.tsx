import { useState } from "react";

import PageLayout from "@/components/page-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import usePermissions from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/lib/permissions";

import UsersTable from "./_component/users-table";
import StaffTable from "./_component/staff-table";
import SessionsTable from "./_component/sessions-table";

const TAB_KEY = "users-page-tab";

const readTab = () => {
  try {
    return window.localStorage.getItem(TAB_KEY) ?? "users";
  } catch {
    return "users";
  }
};

const Users = () => {
  const { can } = usePermissions();
  const canUsers = can(PERMISSIONS.USERS_VIEW);
  const canSessions = can(PERMISSIONS.SESSIONS_VIEW);

  const available = [canUsers && "users", canUsers && "staff", canSessions && "sessions"].filter(
    Boolean,
  ) as string[];

  const [tab, setTab] = useState(readTab);
  const current = available.includes(tab) ? tab : available[0] ?? "users";

  const changeTab = (value: string) => {
    setTab(value);
    try {
      window.localStorage.setItem(TAB_KEY, value);
    } catch {
      /* storage unavailable: the tab just isn't remembered */
    }
  };

  return (
    <PageLayout title="Users & Sessions" subtitle="Accounts, company staff and where people are signed in.">
      <div className="mx-auto mt-4 w-full max-w-[1600px]">
        <Tabs value={current} onValueChange={changeTab}>
          <TabsList>
            {canUsers && <TabsTrigger value="users">Users</TabsTrigger>}
            {canUsers && <TabsTrigger value="staff">Staff</TabsTrigger>}
            {canSessions && <TabsTrigger value="sessions">Sessions</TabsTrigger>}
          </TabsList>

          {canUsers && (
            <TabsContent value="users" className="mt-4">
              <UsersTable />
            </TabsContent>
          )}
          {canUsers && (
            <TabsContent value="staff" className="mt-4">
              <StaffTable />
            </TabsContent>
          )}
          {canSessions && (
            <TabsContent value="sessions" className="mt-4">
              <SessionsTable />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Users;
