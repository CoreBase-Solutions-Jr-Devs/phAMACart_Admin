import { useState } from "react";
import { toast } from "sonner";
import { ChevronDown, ChevronRight } from "lucide-react";

import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  FeatureFlag,
  useGetFeatureFlagsQuery,
  useSetGlobalFeatureMutation,
  useSetTenantFeatureMutation,
} from "@/features/featureFlags/featureFlagsAPI";
import { parseError } from "@/lib/parse-error";

type Choice = "inherit" | "on" | "off";

const toChoice = (value: boolean | null): Choice =>
  value === null ? "inherit" : value ? "on" : "off";

const fromChoice = (choice: Choice): boolean | null =>
  choice === "inherit" ? null : choice === "on";

const StateBadge = ({ on }: { on: boolean }) =>
  on ? <Badge>On</Badge> : <Badge variant="secondary">Off</Badge>;

const FeatureRow = ({ feature }: { feature: FeatureFlag }) => {
  const [open, setOpen] = useState(false);
  const [setGlobal, { isLoading: savingGlobal }] = useSetGlobalFeatureMutation();
  const [setTenant, { isLoading: savingTenant }] = useSetTenantFeatureMutation();

  const overrides = feature.tenants.filter((t) => t.override !== null).length;
  const onCount = feature.tenants.filter((t) => t.effective).length;

  const saveGlobal = async (choice: Choice) => {
    try {
      await setGlobal({ key: feature.key, enabled: fromChoice(choice) }).unwrap();
      toast.success(`${feature.name}: global value updated.`);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  const saveTenant = async (tenantId: string, tenantName: string, choice: Choice) => {
    try {
      await setTenant({ key: feature.key, tenantId, enabled: fromChoice(choice) }).unwrap();
      toast.success(`${feature.name} updated for ${tenantName}.`);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{feature.name}</p>
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{feature.key}</code>
            </div>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
            <p className="text-xs text-muted-foreground">
              On for {onCount} of {feature.tenants.length} tenants
              {overrides > 0 && ` · ${overrides} tenant override${overrides === 1 ? "" : "s"}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">All tenants</span>
            <Select
              value={toChoice(feature.globalOverride)}
              onValueChange={(v) => saveGlobal(v as Choice)}
              disabled={savingGlobal}
            >
              <SelectTrigger className="w-[170px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inherit">
                  Default ({feature.defaultEnabled ? "on" : "off"})
                </SelectItem>
                <SelectItem value="on">On</SelectItem>
                <SelectItem value="off">Off</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="px-0"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          Per-tenant values
        </Button>

        {open && (
          <ul className="divide-y rounded-md border">
            {feature.tenants.map((t) => (
              <li
                key={t.tenantId}
                className="flex flex-col gap-2 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{t.tenantName}</span>
                  <StateBadge on={t.effective} />
                </div>
                <Select
                  value={toChoice(t.override)}
                  onValueChange={(v) => saveTenant(t.tenantId, t.tenantName, v as Choice)}
                  disabled={savingTenant}
                >
                  <SelectTrigger className="w-[170px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inherit">
                      Inherit ({feature.globalEffective ? "on" : "off"})
                    </SelectItem>
                    <SelectItem value="on">On</SelectItem>
                    <SelectItem value="off">Off</SelectItem>
                  </SelectContent>
                </Select>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

/** Dev-only: switch optional features on or off, globally or per tenant. */
const FeatureFlags = () => {
  const { data, isLoading } = useGetFeatureFlagsQuery();

  return (
    <PageLayout
      title="Feature Toggles"
      subtitle="Turn optional features on or off for every pharmacy, or override them for one."
    >
      <div className="mx-auto mt-4 w-full max-w-[1100px] space-y-3">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
        {data?.map((f) => <FeatureRow key={f.key} feature={f} />)}
      </div>
    </PageLayout>
  );
};

export default FeatureFlags;
