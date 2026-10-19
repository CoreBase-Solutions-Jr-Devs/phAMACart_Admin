import { Loader2, ClipboardCheck, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import DatePickerField from "./date-picker-field";
import InlineField, { InlineDivider } from "./inline-field";
import { TranscribeDetails } from "./prescription-details-dialog";

/* ===============================================================
   TranscriptionSection
   -----------------------------------------------------------------
   Owns the "Document Transcription" card: the editable form (ID +
   three date pickers) when details are missing/being edited, and the
   compact read-only summary once they're saved.
=============================================================== */

interface Props {
  details: TranscribeDetails;
  onDetailsChange: (details: TranscribeDetails) => void;
  isTranscribed: boolean;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  isSaving: boolean;
  onSave: () => void;
}

const TranscriptionSection = ({
  details,
  onDetailsChange,
  isTranscribed,
  isEditing,
  onStartEdit,
  onCancelEdit,
  isSaving,
  onSave,
}: Props) => {
  const showForm = !isTranscribed || isEditing;
  const today = new Date().toISOString().slice(0, 10);

  const updateField = <K extends keyof TranscribeDetails>(
    key: K,
    value: TranscribeDetails[K]
  ): void => {
    onDetailsChange({ ...details, [key]: value });
  };

  return (
    <div className="shrink-0 bg-slate-50/70 px-7 py-2">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex h-[46px] items-center justify-between border-b border-slate-100 px-5 bg-slate-50/40">
          <div className="flex items-center gap-2">
            <ClipboardCheck
              className={cn("h-4 w-4", isTranscribed ? "text-emerald-600" : "text-amber-500")}
            />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Document Transcription
            </h3>
            {isTranscribed && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                Saved
              </span>
            )}
          </div>

          {isTranscribed && !isEditing && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 text-xs text-slate-600 hover:text-slate-900"
              onClick={onStartEdit}
            >
              <Pencil className="h-3 w-3" /> Edit Details
            </Button>
          )}
        </div>

        {showForm ? (
          <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                Patient / National ID <span className="text-rose-500">*</span>
              </label>
              <Input
                className="h-9 text-xs"
                value={details.nationalIdOrPatientNumber}
                onChange={(e) => updateField("nationalIdOrPatientNumber", e.target.value)}
                placeholder="e.g. 32XXXXXX"
              />
            </div>

            <DatePickerField
              label="Patient DOB"
              required
              value={details.patientDateOfBirth}
              onChange={(value) => updateField("patientDateOfBirth", value)}
              maxDate={today}
              placeholder="Select date of birth"
            />

            <DatePickerField
              label="Issue Date"
              required
              value={details.issueDate}
              onChange={(value) => updateField("issueDate", value)}
              placeholder="Select issue date"
            />

            <DatePickerField
              label="Expiry Date"
              required
              value={details.expiryDate}
              onChange={(value) => updateField("expiryDate", value)}
              minDate={details.issueDate || undefined}
              placeholder="Select expiry date"
            />

            <div className="col-span-2 flex items-center justify-end gap-2 sm:col-span-4">
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={onCancelEdit}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                className="h-8 gap-1.5 bg-slate-900 text-xs hover:bg-slate-800"
                disabled={isSaving}
                onClick={onSave}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Details"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-6 overflow-x-auto px-5 py-2.5 bg-white">
            <InlineField label="National / Patient ID" value={details.nationalIdOrPatientNumber} />
            <InlineDivider />
            <InlineField
              label="DOB"
              value={
                details.patientDateOfBirth
                  ? new Date(details.patientDateOfBirth).toLocaleDateString()
                  : "-"
              }
            />
            <InlineDivider />
            <InlineField
              label="Issue"
              value={details.issueDate ? new Date(details.issueDate).toLocaleDateString() : "-"}
            />
            <InlineDivider />
            <InlineField
              label="Expiry"
              value={details.expiryDate ? new Date(details.expiryDate).toLocaleDateString() : "-"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptionSection;