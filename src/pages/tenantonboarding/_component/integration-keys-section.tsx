import { KeyRound, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CompanyProfileIntegration } from "@/features/tenantOnboarding/tenantOnboardingType";

interface IntegrationKeysSectionProps {
  integrationKeys: CompanyProfileIntegration[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (
    index: number,
    key: keyof CompanyProfileIntegration,
    value: string,
  ) => void;
}

export function IntegrationKeysSection({
  integrationKeys,
  onAdd,
  onRemove,
  onUpdate,
}: IntegrationKeysSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="size-5" />
              Integration Keys
            </CardTitle>
            <CardDescription>
              Optional integration credentials for the new tenant.
            </CardDescription>
          </div>
          <Button type="button" variant="outline" onClick={onAdd}>
            <Plus className="size-4" />
            Add key
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {integrationKeys.length === 0 && (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No integration keys added.
          </p>
        )}
        {integrationKeys.map((integration, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-3 rounded-lg border p-4 md:grid-cols-[220px_1fr_auto]"
          >
            <Input
              placeholder="Key"
              value={integration.key}
              onChange={(event) => onUpdate(index, "key", event.target.value)}
            />
            <Input
              type="password"
              placeholder="Value"
              value={integration.value}
              onChange={(event) => onUpdate(index, "value", event.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
              aria-label="Remove integration key"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}