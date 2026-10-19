import { Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import MultiFileUploader, {
  UploadFileItem,
} from "@/components/upload/MultiFileUploader";

const LOGO_SLOT_ID = "provision-company-logo";
const LICENSE_SLOT_ID = "provision-pharmacy-license";
const LOGO_ACCEPT = "image/png,image/jpeg,image/jpg";
const LICENSE_ACCEPT = "image/png,image/jpeg,image/jpg,application/pdf";

interface CompanyInfoSectionProps {
  companyName: string;
  clientId: string;
  whatsappChatLink: string;
  onCompanyNameChange: (value: string) => void;
  onClientIdChange: (value: string) => void;
  onWhatsappChatLinkChange: (value: string) => void;
  logoFiles: UploadFileItem[];
  pharmacyLicenseFiles: UploadFileItem[];
  onLogoChange: (files: UploadFileItem[]) => void;
  onLicenseChange: (files: UploadFileItem[]) => void;
}

export function CompanyInfoSection({
  companyName,
  clientId,
  whatsappChatLink,
  onCompanyNameChange,
  onClientIdChange,
  onWhatsappChatLinkChange,
  logoFiles,
  pharmacyLicenseFiles,
  onLogoChange,
  onLicenseChange,
}: CompanyInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="size-5" />
          Company Information
        </CardTitle>
        <CardDescription>
          Information supplied by the client for the new company profile.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company name</Label>
            <Input
              id="company-name"
              value={companyName}
              onChange={(event) => onCompanyNameChange(event.target.value)}
              placeholder="e.g. ABC Pharmacy"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-id">Client ID</Label>
            <Input
              id="client-id"
              type="number"
              min={1}
              value={clientId}
              onChange={(event) => onClientIdChange(event.target.value)}
              placeholder="e.g. 1001"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="whatsapp-link">WhatsApp chat link</Label>
            <Input
              id="whatsapp-link"
              type="url"
              value={whatsappChatLink}
              onChange={(event) =>
                onWhatsappChatLinkChange(event.target.value)
              }
              placeholder="https://wa.me/2547XXXXXXXX"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <div>
              <Label>Company logo</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                PNG or JPEG image.
              </p>
            </div>
            <MultiFileUploader
              key={LOGO_SLOT_ID}
              value={logoFiles}
              onChange={onLogoChange}
              multiple={false}
              accept={LOGO_ACCEPT}
            />
          </div>

          <div className="space-y-2">
            <div>
              <Label>Pharmacy license</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPEG or PDF document.
              </p>
            </div>
            <MultiFileUploader
              key={LICENSE_SLOT_ID}
              value={pharmacyLicenseFiles}
              onChange={onLicenseChange}
              multiple={false}
              accept={LICENSE_ACCEPT}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}