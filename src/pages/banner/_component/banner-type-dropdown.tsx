import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* =========================
   CONSTANTS
========================= */
export const BANNER_TYPES = [
  { label: "Occasional", value: 0 },
  { label: "Promotional", value: 1 },
  { label: "Fixed", value: 2 },
] as const;

export type BannerTypeValue = (typeof BANNER_TYPES)[number]["value"];

/* =========================
   PROPS
========================= */
interface BannerTypeDropdownProps {
  value?: number | string;
  onChange: (value: number) => void;
  error?: string;
}

/* =========================
   COMPONENT
========================= */
export const BannerTypeDropdown = ({
  value,
  onChange,
  error,
}: BannerTypeDropdownProps) => {
  const [open, setOpen] = useState(false);

  const selected = BANNER_TYPES.find(
    (t) => String(t.value) === String(value)
  );

  return (
    <div>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="w-full flex items-center justify-between border rounded-md p-2 text-sm bg-background hover:bg-accent transition-colors"
          >
            <span className={selected ? "text-foreground" : "text-muted-foreground"}>
              {selected ? selected.label : "Select Type"}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
          {BANNER_TYPES.map((type) => (
            <DropdownMenuItem
              key={type.value}
              onSelect={() => {
                onChange(type.value);
                setOpen(false);
              }}
            >
              {type.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};