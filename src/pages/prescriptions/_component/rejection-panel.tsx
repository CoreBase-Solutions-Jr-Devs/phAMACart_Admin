import { Input } from "@/components/ui/input";
import { RejectionReason } from "@/features/prescriptions/prescriptionsType";

const REJECTION_REASON_OPTIONS: { value: RejectionReason; label: string }[] = [
  { value: RejectionReason.ExpiredPrescription, label: "Expired prescription" },
  { value: RejectionReason.IllegiblePrescription, label: "Illegible prescription" },
  { value: RejectionReason.UnavailableMedication, label: "Unavailable medication" },
  { value: RejectionReason.InvalidPrescriber, label: "Invalid prescriber" },
];

interface Props {
  reason: RejectionReason | "";
  onReasonChange: (reason: RejectionReason | "") => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

const RejectionPanel = ({ reason, onReasonChange, notes, onNotesChange }: Props) => (
  <div className="flex flex-col gap-3 rounded-lg border border-rose-200 bg-rose-50/50 p-3 sm:flex-row sm:items-end">
    <div className="flex-1 space-y-1">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-rose-800">
        Rejection Reason <span className="text-rose-500">*</span>
      </label>
      <select
        value={String(reason)}
        onChange={(e) =>
          onReasonChange(e.target.value === "" ? "" : (Number(e.target.value) as RejectionReason))
        }
        className="h-9 w-full rounded-md border border-rose-200 bg-white px-3 text-xs outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200"
      >
        <option value="">Select a reason...</option>
        {REJECTION_REASON_OPTIONS.map((opt) => (
          <option key={opt.value} value={String(opt.value)}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>

    <div className="flex-[2] space-y-1">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-rose-800">
        Notes <span className="text-rose-400 font-normal">(optional)</span>
      </label>
      <Input
        className="h-9 text-xs"
        value={notes}
        maxLength={1000}
        placeholder="Additional context for rejection..."
        onChange={(e) => onNotesChange(e.target.value)}
      />
    </div>
  </div>
);

export default RejectionPanel;