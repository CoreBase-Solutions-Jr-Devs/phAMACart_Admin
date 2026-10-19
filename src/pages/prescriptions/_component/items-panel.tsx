import { cn } from "@/lib/utils";
import ItemDecisionForm from "./item-decision-form";
import ItemsReviewTable from "./items-review-table";
import { PrescriptionItemDecision } from "@/features/prescriptions/prescriptionsType";

/* ===============================================================
   ItemsPanel
   -----------------------------------------------------------------
   Wraps the item configurator + review table in the "Prescription
   Items" card, disabled until transcription is saved.
=============================================================== */

interface Props {
  itemDecisions: PrescriptionItemDecision[];
  itemNames: Record<string, string>;
  onAdd: (decision: PrescriptionItemDecision, names: Record<string, string>) => void;
  onRemove: (index: number) => void;
  isTranscribed: boolean;
}

const ItemsPanel = ({ itemDecisions, itemNames, onAdd, onRemove, isTranscribed }: Props) => (
  <div className="min-h-0 flex-1 bg-slate-50/70 px-7 pt-2 pb-4">
    <div
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-opacity",
        !isTranscribed && "pointer-events-none opacity-40"
      )}
    >
      <div className="flex h-[46px] shrink-0 items-center justify-between border-b border-slate-100 px-5 bg-slate-50/40">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Prescription Items
          </h3>
          <span className="rounded-full bg-slate-200/60 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
            {itemDecisions.length} {itemDecisions.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      <ItemDecisionForm
        existingProductIds={itemDecisions.map((item) => item.productId)}
        onAdd={onAdd}
      />

      <div className="min-h-0 flex-1 overflow-hidden">
        <ItemsReviewTable
          itemDecisions={itemDecisions}
          itemNames={itemNames}
          onRemove={onRemove}
        />
      </div>
    </div>
  </div>
);

export default ItemsPanel;