import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ShieldCheck } from "lucide-react";

import {
  PendingPrescriptionDto,
  PrescriptionItemDecision,
  RejectionReason,
} from "@/features/prescriptions/prescriptionsType";

import { toast } from "sonner";
import { parseError } from "@/lib/parse-error";

import PatientOverview from "./patient-overview";
import TranscriptionSection from "./transcription-section";
import ItemsPanel from "./items-panel";
import DialogFooterActions from "./dialog-footer-actions";

/* ===============================================================
   TYPES
=============================================================== */

export interface TranscribeDetails {
  nationalIdOrPatientNumber: string;
  patientDateOfBirth: string; // yyyy-MM-dd
  issueDate: string; // yyyy-MM-dd
  expiryDate: string; // yyyy-MM-dd
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prescription: PendingPrescriptionDto | null;

  onTranscribe: (
    prescription: PendingPrescriptionDto,
    details: TranscribeDetails
  ) => Promise<void>;

  onApprove: (
    prescription: PendingPrescriptionDto,
    itemDecisions: PrescriptionItemDecision[]
  ) => Promise<void>;

  onReject: (
    prescription: PendingPrescriptionDto,
    reason: RejectionReason,
    notes: string | null
  ) => Promise<void>;

  isTranscribing?: boolean;
  isApproving?: boolean;
  isRejecting?: boolean;
}

const emptyTranscribeDetails: TranscribeDetails = {
  nationalIdOrPatientNumber: "",
  patientDateOfBirth: "",
  issueDate: "",
  expiryDate: "",
};

const toDateInputValue = (value: string | null | undefined): string => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

/* ===============================================================
   COMPONENT
   -----------------------------------------------------------------
   This file now only holds top-level dialog state (item decisions,
   transcription details, reject-mode) and wires it into the
   extracted sections below. Each section owns its own local UI
   concerns (e.g. the item draft, or the date-picker's own state).
=============================================================== */

const PrescriptionDetailsDialog = ({
  open,
  onOpenChange,
  prescription,
  onTranscribe,
  onApprove,
  onReject,
  isTranscribing = false,
  isApproving = false,
  isRejecting = false,
}: Props) => {
  const [itemDecisions, setItemDecisions] = useState<PrescriptionItemDecision[]>([]);
  const [itemNames, setItemNames] = useState<Record<string, string>>({});

  const [transcribeDetails, setTranscribeDetails] = useState<TranscribeDetails>(emptyTranscribeDetails);
  const [isEditingTranscription, setIsEditingTranscription] = useState<boolean>(false);
  const [justTranscribed, setJustTranscribed] = useState<boolean>(false);

  const isTranscribed =
    justTranscribed ||
    Boolean(
      prescription?.nationalIdOrPatientNumber &&
        prescription?.patientDateOfBirth &&
        prescription?.issueDate &&
        prescription?.expiryDate
    );

  const [isRejectMode, setIsRejectMode] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<RejectionReason | "">("");
  const [rejectionNotes, setRejectionNotes] = useState<string>("");

  useEffect(() => {
    if (!open) {
      setItemDecisions([]);
      setItemNames({});
      setIsRejectMode(false);
      setRejectionReason("");
      setRejectionNotes("");
      setTranscribeDetails(emptyTranscribeDetails);
      setIsEditingTranscription(false);
      setJustTranscribed(false);
      return;
    }

    if (prescription) {
      setTranscribeDetails({
        nationalIdOrPatientNumber: prescription.nationalIdOrPatientNumber ?? "",
        patientDateOfBirth: toDateInputValue(prescription.patientDateOfBirth),
        issueDate: toDateInputValue(prescription.issueDate),
        expiryDate: toDateInputValue(prescription.expiryDate),
      });
    }
  }, [open, prescription]);

  const handleSaveTranscription = async (): Promise<void> => {
    const { nationalIdOrPatientNumber, patientDateOfBirth, issueDate, expiryDate } = transcribeDetails;

    if (!nationalIdOrPatientNumber.trim()) {
      toast.error("Enter the patient / national ID.");
      return;
    }
    if (!patientDateOfBirth) {
      toast.error("Enter the patient's date of birth.");
      return;
    }
    if (!issueDate) {
      toast.error("Enter the prescription issue date.");
      return;
    }
    if (!expiryDate) {
      toast.error("Enter the prescription expiry date.");
      return;
    }
    if (new Date(expiryDate) < new Date(issueDate)) {
      toast.error("Expiry date cannot precede the issue date.");
      return;
    }

    try {
      await onTranscribe(prescription!, {
        nationalIdOrPatientNumber: nationalIdOrPatientNumber.trim(),
        patientDateOfBirth,
        issueDate,
        expiryDate,
      });
      setJustTranscribed(true);
      setIsEditingTranscription(false);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  const handleAddItem = (decision: PrescriptionItemDecision, names: Record<string, string>): void => {
    setItemDecisions((current) => [...current, decision]);
    setItemNames((current) => ({ ...current, ...names }));
  };

  const handleRemoveItem = (index: number): void => {
    setItemDecisions((current) => current.filter((_, i) => i !== index));
  };

  const handleApprove = async (): Promise<void> => {
    if (!isTranscribed) {
      toast.error("Transcribe the patient and prescription details first.");
      return;
    }
    if (itemDecisions.length === 0) {
      toast.error("Add at least one prescription item before approving.");
      return;
    }

    try {
      await onApprove(prescription!, itemDecisions);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  const handleCancelReject = (): void => {
    setIsRejectMode(false);
    setRejectionReason("");
    setRejectionNotes("");
  };

  const handleConfirmReject = async (): Promise<void> => {
    if (!isTranscribed) {
      toast.error("Transcribe the patient and prescription details first.");
      return;
    }
    if (rejectionReason === "") {
      toast.error("Select a rejection reason.");
      return;
    }

    try {
      await onReject(prescription!, rejectionReason, rejectionNotes.trim() ? rejectionNotes.trim() : null);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  if (!prescription) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[94vh] w-[96vw] max-w-[1600px] flex-col gap-0 overflow-hidden p-0 sm:max-w-[1600px]">
        <DialogHeader className="flex h-[64px] shrink-0 flex-row items-center justify-between border-b bg-white px-7 py-0 space-y-0">
          <div>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Prescription Review & Transcription
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {isTranscribed
                ? "Review items and submit authorization for customer fulfillment."
                : "Transcribe critical prescription dates and patient identity before review."}
            </DialogDescription>
          </div>
          {isTranscribed && (
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <ShieldCheck className="h-4 w-4" /> Ready for Authorization
            </div>
          )}
        </DialogHeader>

        <PatientOverview prescription={prescription} />

        <TranscriptionSection
          details={transcribeDetails}
          onDetailsChange={setTranscribeDetails}
          isTranscribed={isTranscribed}
          isEditing={isEditingTranscription}
          onStartEdit={() => setIsEditingTranscription(true)}
          onCancelEdit={() => setIsEditingTranscription(false)}
          isSaving={isTranscribing}
          onSave={handleSaveTranscription}
        />

        <ItemsPanel
          itemDecisions={itemDecisions}
          itemNames={itemNames}
          onAdd={handleAddItem}
          onRemove={handleRemoveItem}
          isTranscribed={isTranscribed}
        />

        <DialogFooterActions
          itemCount={itemDecisions.length}
          isTranscribed={isTranscribed}
          isRejectMode={isRejectMode}
          onEnterRejectMode={() => setIsRejectMode(true)}
          onCancelReject={handleCancelReject}
          rejectionReason={rejectionReason}
          onRejectionReasonChange={setRejectionReason}
          rejectionNotes={rejectionNotes}
          onRejectionNotesChange={setRejectionNotes}
          onApprove={handleApprove}
          onConfirmReject={handleConfirmReject}
          isApproving={isApproving}
          isRejecting={isRejecting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionDetailsDialog;