import PageLayout from "@/components/page-layout";
import UsersTable from "./_component/users-table";

const Users = () => {
  return (
    <PageLayout
      title="Users"
      subtitle="Manage user accounts and their permissions."
    >
      <div className="mx-auto mt-4 w-full max-w-[1600px]">
        <UsersTable />
      </div>
    </PageLayout>
  );
};

export default Users;