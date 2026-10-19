import { Database, Server } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface ProvisioningConfigSectionProps {
  slug: string;
  connectionDb: string;
  thirdPartyBaseUrl: string;
  onSlugChange: (value: string) => void;
  onConnectionDbChange: (value: string) => void;
  onThirdPartyBaseUrlChange: (value: string) => void;
}

export function ProvisioningConfigSection({
  slug,
  connectionDb,
  thirdPartyBaseUrl,
  onSlugChange,
  onConnectionDbChange,
  onThirdPartyBaseUrlChange,
}: ProvisioningConfigSectionProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="size-5" />
          Provisioning Configuration
        </CardTitle>
        <CardDescription>
          Developer-controlled values used to create and configure the
          tenant infrastructure.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="tenant-slug">Tenant slug</Label>
          <Input
            id="tenant-slug"
            value={slug}
            onChange={(event) => onSlugChange(event.target.value)}
            placeholder="abc-pharmacy"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="connection-db">Connection database</Label>
          <div className="relative">
            <Database className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="connection-db"
              className="pl-9"
              value={connectionDb}
              onChange={(event) => onConnectionDbChange(event.target.value)}
              placeholder="E1001"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="third-party-url">Third-party base URL</Label>
          <Input
            id="third-party-url"
            type="url"
            value={thirdPartyBaseUrl}
            onChange={(event) => onThirdPartyBaseUrlChange(event.target.value)}
            placeholder="https://..."
          />
        </div>
      </CardContent>
    </Card>
  );
}