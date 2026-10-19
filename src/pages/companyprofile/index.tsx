import PageLayout from "@/components/page-layout";
import { CompanyProfileForm } from "./_component/company-profile-form";

const CompanyProfile = () => {
  return (
    <PageLayout
      title="Company Profile"
      subtitle="View and update your company's public details, contacts and addresses."
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <CompanyProfileForm />
      </div>
    </PageLayout>
  );
};

export default CompanyProfile;