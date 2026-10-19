import { Globe, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DomainInput } from "@/features/tenantOnboarding/tenantOnboardingType";

interface DomainsSectionProps {
  domains: DomainInput[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, key: keyof DomainInput, value: string) => void;
}

export function DomainsSection({
  domains,
  onAdd,
  onRemove,
  onUpdate,
}: DomainsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="size-5" />
              Domains
            </CardTitle>
            <CardDescription>
              Configure the client, admin, and backend hosts for this tenant.
            </CardDescription>
          </div>
          <Button type="button" variant="outline" onClick={onAdd}>
            <Plus className="size-4" />
            Add domain
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {domains.length === 0 && (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No domains added.
          </p>
        )}
        {domains.map((domain, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-3 rounded-lg border p-4 md:grid-cols-[1fr_180px_auto]"
          >
            <Input
              placeholder="example.co.ke or example.co.ke:5008"
              value={domain.host}
              onChange={(event) => onUpdate(index, "host", event.target.value)}
            />
            <Select
              value={domain.type}
              onValueChange={(value) => onUpdate(index, "type", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Client">Client</SelectItem>
                <SelectItem value="Backend">Backend</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
              aria-label="Remove domain"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}