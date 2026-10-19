import { Check, X } from "lucide-react";
import { PrescriptionItemStatus } from "@/features/prescriptions/prescriptionsType";

const DecisionBadge = ({ value }: { value: PrescriptionItemStatus }) => {
  switch (value) {
    case PrescriptionItemStatus.Approved:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <Check className="h-3 w-3" /> Approved
        </span>
      );
    case PrescriptionItemStatus.Unavailable:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
          <X className="h-3 w-3" /> Unavailable
        </span>
      );
    case PrescriptionItemStatus.Substituted:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
          Substituted
        </span>
      );
    default:
      return null;
  }
};

export default DecisionBadge;