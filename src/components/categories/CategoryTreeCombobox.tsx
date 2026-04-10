import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { Category } from "@/features/categories/categoriesType";
import { flattenCategoryTree } from "@/lib/categoryTreeUtils";

interface Props {
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
}

const CategoryTreeCombobox = ({ categories, value, onChange }: Props) => {
  const [open, setOpen] = React.useState(false);

  const flat = React.useMemo(
    () => flattenCategoryTree(categories),
    [categories]
  );

  const selected = flat.find((c) => c.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[260px] justify-between"
        >
          {selected?.name || "Select category"}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandEmpty>No category found.</CommandEmpty>

          <CommandGroup className="max-h-[300px] overflow-auto">
            {flat.map((cat) => (
              <CommandItem
                key={cat.id}
                value={cat.name}
                disabled={!cat.isLeaf}
                onSelect={() => {
                  if (!cat.isLeaf) return;
                  onChange(cat.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2",
                  !cat.isLeaf && "opacity-50 cursor-not-allowed"
                )}
              >
                <div
                  style={{ paddingLeft: `${cat.level * 12}px` }}
                  className="flex items-center gap-2"
                >
                  {cat.isLeaf && (
                    <Check
                      className={cn(
                        "h-4 w-4",
                        value === cat.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  )}
                  <span>{cat.name}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryTreeCombobox;