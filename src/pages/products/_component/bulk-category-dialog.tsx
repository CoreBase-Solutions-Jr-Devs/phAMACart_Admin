import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBulkAssignCategoryMutation } from "@/features/products/productsAPI";
import type { Category } from "@/features/categories/categoriesType";
import { parseError } from "@/lib/parse-error";

interface Props {
  open: boolean;
  productIds: string[];
  categories: Category[];
  onOpenChange: (open: boolean) => void;
  onDone: () => void;
}

/** Moves the selected products into one leaf (sub-)category. */
export const BulkCategoryDialog = ({ open, productIds, categories, onOpenChange, onDone }: Props) => {
  const [categoryId, setCategoryId] = useState("");
  const [assign, { isLoading }] = useBulkAssignCategoryMutation();

  const submit = async () => {
    if (!categoryId) return;

    try {
      const result = await assign({ productIds, categoryId }).unwrap();
      const name = categories.find((c) => c.id === categoryId)?.name ?? "the category";

      if (result.missingProductIds.length > 0) {
        toast.warning(
          `Moved ${result.updatedCount} of ${result.requestedCount} products to ${name}. ` +
            `${result.missingProductIds.length} no longer exist.`,
        );
      } else {
        toast.success(`Moved ${result.updatedCount} products to ${name}.`);
      }

      setCategoryId("");
      onDone();
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign category</DialogTitle>
          <DialogDescription>
            Move {productIds.length} selected product{productIds.length === 1 ? "" : "s"} into a
            sub-category. Only last-level categories can hold products.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.parentCategoryName
                    ? `${category.parentCategoryName} › ${category.name}`
                    : category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!categoryId || isLoading}>
            {isLoading ? "Moving…" : "Move products"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
