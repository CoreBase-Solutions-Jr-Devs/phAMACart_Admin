import { AlertCircle, Check, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import RejectionPanel from "./rejection-panel";
import { RejectionReason } from "@/features/prescriptions/prescriptionsType";

interface Props {
  itemCount: number;
  isTranscribed: boolean;

  isRejectMode: boolean;
  onEnterRejectMode: () => void;
  onCancelReject: () => void;

  rejectionReason: RejectionReason | "";
  onRejectionReasonChange: (reason: RejectionReason | "") => void;
  rejectionNotes: string;
  onRejectionNotesChange: (notes: string) => void;

  onApprove: () => void;
  onConfirmReject: () => void;

  isApproving: boolean;
  isRejecting: boolean;
}

const DialogFooterActions = ({
  itemCount,
  isTranscribed,
  isRejectMode,
  onEnterRejectMode,
  onCancelReject,
  rejectionReason,
  onRejectionReasonChange,
  rejectionNotes,
  onRejectionNotesChange,
  onApprove,
  onConfirmReject,
  isApproving,
  isRejecting,
}: Props) => (
  <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-white px-7 py-3">
    {isRejectMode && (
      <RejectionPanel
        reason={rejectionReason}
        onReasonChange={onRejectionReasonChange}
        notes={rejectionNotes}
        onNotesChange={onRejectionNotesChange}
      />
    )}

    {!isTranscribed && !isRejectMode && (
      <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
        <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
        Save prescription details above before approving or rejecting.
      </div>
    )}

    <div className="flex items-center justify-between gap-4">
      <div className="text-xs font-medium text-slate-500">
        {itemCount === 0 ? (
          "No items added"
        ) : (
          <span>
            <strong className="text-slate-900">{itemCount}</strong> {itemCount === 1 ? "item" : "items"}{" "}
            configured
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isRejectMode ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 text-xs"
              disabled={isRejecting}
              onClick={onCancelReject}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="h-9 min-w-[130px] gap-1.5 text-xs bg-rose-600 hover:bg-rose-700"
              disabled={isApproving || isRejecting}
              onClick={onConfirmReject}
            >
              {isRejecting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Rejecting...
                </>
              ) : (
                <>
                  <X className="h-3.5 w-3.5" /> Confirm Reject
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 min-w-[100px] gap-1.5 text-xs text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
              disabled={isApproving || isRejecting || !isTranscribed}
              onClick={onEnterRejectMode}
            >
              <X className="h-3.5 w-3.5" /> Reject
            </Button>

            <Button
              type="button"
              size="sm"
              className="h-9 min-w-[130px] gap-1.5 bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm"
              disabled={isApproving || isRejecting || !isTranscribed || itemCount === 0}
              onClick={onApprove}
            >
              {isApproving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Approving...
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" /> Approve Prescription
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  </div>
);

export default DialogFooterActions;