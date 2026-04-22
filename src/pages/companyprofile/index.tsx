import PageLayout from "@/components/page-layout";
import { CompanyProfileForm } from "./_component/company-profile-form";

const CompanyProfile = () => {
  return (
    <PageLayout
      title="Company Profile"
      subtitle="View and update your company's public details, contacts and addresses."
    >
      <div className="w-full h-auto">
        <CompanyProfileForm />
      </div>
    </PageLayout>
  );
};

export default CompanyProfile;
