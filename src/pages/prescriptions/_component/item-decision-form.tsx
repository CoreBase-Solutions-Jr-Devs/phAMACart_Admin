import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductSearchCombobox from "./product-search-combobox";
import {
  PrescriptionItemDecision,
  PrescriptionItemStatus,
  PrescriptionProductSearchResult,
} from "@/features/prescriptions/prescriptionsType";

/* ===============================================================
   ItemDecisionForm
   -----------------------------------------------------------------
   Self-contained "add a prescription item" row: holds its own draft
   state and validation, and only reports a finished, valid decision
   upward via onAdd. The parent never has to know about draft shape.
=============================================================== */

interface DraftItem {
  productId: string;
  productName: string;
  availableStock: number;
  authorizedQty: number;
  decision: PrescriptionItemStatus;
  substituteProductId: string;
  substituteProductName: string;
  substituteAvailableStock: number;
}

const emptyDraft: DraftItem = {
  productId: "",
  productName: "",
  availableStock: 0,
  authorizedQty: 1,
  decision: PrescriptionItemStatus.Approved,
  substituteProductId: "",
  substituteProductName: "",
  substituteAvailableStock: 0,
};

interface Props {
  existingProductIds: string[];
  onAdd: (decision: PrescriptionItemDecision, names: Record<string, string>) => void;
}

const ItemDecisionForm = ({ existingProductIds, onAdd }: Props) => {
  const [draft, setDraft] = useState<DraftItem>(emptyDraft);

  const isUnavailable = draft.decision === PrescriptionItemStatus.Unavailable;
  const isSubstituted = draft.decision === PrescriptionItemStatus.Substituted;

  const handleProductSelect = (product: PrescriptionProductSearchResult): void => {
    setDraft((current) => ({
      ...current,
      productId: product.productId,
      productName: product.name,
      availableStock: product.availableQuantity,
      authorizedQty:
        product.availableQuantity > 0
          ? Math.min(current.authorizedQty || 1, product.availableQuantity)
          : 0,
    }));
  };

  const handleSubstituteSelect = (product: PrescriptionProductSearchResult): void => {
    setDraft((current) => ({
      ...current,
      substituteProductId: product.productId,
      substituteProductName: product.name,
      substituteAvailableStock: product.availableQuantity,
    }));
  };

  const handleQuantityChange = (value: string): void => {
    const quantity = Number(value);
    if (!Number.isFinite(quantity)) {
      setDraft((current) => ({ ...current, authorizedQty: 0 }));
      return;
    }
    const normalizedQuantity = Math.max(0, Math.floor(quantity));

    if (draft.availableStock > 0 && normalizedQuantity > draft.availableStock) {
      toast.error(`Only ${draft.availableStock} units are currently available.`);
      setDraft((current) => ({ ...current, authorizedQty: current.availableStock }));
      return;
    }

    setDraft((current) => ({ ...current, authorizedQty: normalizedQuantity }));
  };

  const handleDecisionChange = (decision: PrescriptionItemStatus): void => {
    setDraft((current) => ({
      ...current,
      decision,
      authorizedQty:
        decision === PrescriptionItemStatus.Unavailable
          ? 0
          : current.authorizedQty || (current.availableStock > 0 ? 1 : 0),
    }));
  };

  const handleAddItem = (): void => {
    const productId = draft.productId.trim();

    if (!productId) {
      toast.error("Select a product before adding an item.");
      return;
    }
    if (!isUnavailable && draft.availableStock <= 0) {
      toast.error("This product has no available stock.");
      return;
    }
    if (!isUnavailable && draft.authorizedQty <= 0) {
      toast.error("Authorized quantity must be greater than zero.");
      return;
    }
    if (!isUnavailable && draft.authorizedQty > draft.availableStock) {
      toast.error(`Authorized quantity cannot exceed stock of ${draft.availableStock}.`);
      return;
    }
    if (isSubstituted && !draft.substituteProductId.trim()) {
      toast.error("Select a substitute product.");
      return;
    }
    if (isSubstituted && draft.substituteAvailableStock <= 0) {
      toast.error("The selected substitute product has no available stock.");
      return;
    }
    if (existingProductIds.includes(productId)) {
      toast.error("This product has already been added.");
      return;
    }

    const names: Record<string, string> = { [productId]: draft.productName };
    if (isSubstituted) {
      names[draft.substituteProductId.trim()] = draft.substituteProductName;
    }

    onAdd(
      {
        productId,
        authorizedQty: isUnavailable ? 0 : draft.authorizedQty,
        decision: draft.decision,
        substituteProductId: isSubstituted ? draft.substituteProductId.trim() : null,
      },
      names
    );

    setDraft(emptyDraft);
  };

  return (
    <div className="shrink-0 border-b border-slate-100 bg-slate-50/30 p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 items-end">
        <div className="sm:col-span-4 space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            Product <span className="text-rose-500">*</span>
          </label>
          <ProductSearchCombobox
            value={draft.productId}
            selectedName={draft.productName}
            onSelect={handleProductSelect}
            placeholder="Search prescribed products..."
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            Qty
          </label>
          <Input
            type="number"
            className="h-10 text-xs"
            min={1}
            max={draft.availableStock || undefined}
            value={draft.authorizedQty}
            disabled={isUnavailable || !draft.productId}
            onChange={(e) => handleQuantityChange(e.target.value)}
          />
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            Decision
          </label>
          <select
            value={String(draft.decision)}
            onChange={(e) => handleDecisionChange(Number(e.target.value) as PrescriptionItemStatus)}
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
          >
            <option value={String(PrescriptionItemStatus.Approved)}>Approve</option>
            <option value={String(PrescriptionItemStatus.Unavailable)}>Unavailable</option>
            <option value={String(PrescriptionItemStatus.Substituted)}>Substitute</option>
          </select>
        </div>

        <div className="sm:col-span-3 space-y-1">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            Substitute {isSubstituted ? <span className="text-rose-500">*</span> : ""}
          </label>
          <ProductSearchCombobox
            value={draft.substituteProductId}
            selectedName={draft.substituteProductName}
            disabled={!isSubstituted}
            onSelect={handleSubstituteSelect}
            placeholder="Search substitute..."
          />
        </div>

        <div className="sm:col-span-1">
          <Button
            type="button"
            className="h-10 w-full bg-slate-900 text-xs font-medium hover:bg-slate-800"
            onClick={handleAddItem}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemDecisionForm;