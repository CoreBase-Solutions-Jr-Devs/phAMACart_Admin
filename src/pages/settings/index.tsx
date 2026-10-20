import PageLayout from "@/components/page-layout";
import Appearance from "./appearance";
import Account from "./account";
import ChangePassword from "./change-password";

const Settings = () => {
  return (
    <PageLayout
      title="Settings"
      subtitle="Configure the settings for this application."
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="mx-auto w-full max-w-5xl space-y-6">
          <Appearance />
          <Account />
          <ChangePassword />
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;