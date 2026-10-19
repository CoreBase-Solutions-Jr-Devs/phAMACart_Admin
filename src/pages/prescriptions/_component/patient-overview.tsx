import PrescriptionDocumentPreview from "./prescription-doc-preview";
import InlineField, { InlineDivider } from "./inline-field";
import type { PendingPrescriptionDto } from "@/features/prescriptions/prescriptionsType";

/* ===============================================================
   PatientOverview
   -----------------------------------------------------------------
   Document preview + the quick-glance patient/doctor/contact strip
   shown at the top of the dialog, above transcription and items.
=============================================================== */

interface Props {
  prescription: PendingPrescriptionDto;
}

const PatientOverview = ({ prescription }: Props) => (
  <div className="shrink-0 bg-slate-50/70 px-7 pt-4 pb-2">
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <div className="h-[210px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-4">
        <div className="h-full bg-slate-100 p-2.5">
          <div className="h-full w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
            <PrescriptionDocumentPreview documentBlobPath={prescription.documentBlobPath} />
          </div>
        </div>
      </div>
    </div>

    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex h-[48px] items-center gap-5 overflow-x-auto px-5">
        <InlineField label="Patient" value={prescription.fullName} />
        <InlineDivider />
        <InlineField label="Doctor" value={prescription.doctorName || "-"} />
        <InlineDivider />
        <InlineField label="Phone" value={prescription.cellphoneNumber} />
        <InlineDivider />
        <InlineField label="Email" value={prescription.email} className="min-w-[180px]" />
        <InlineDivider />
        <InlineField label="Insurance" value={prescription.insuranceNumber || "-"} />
      </div>
    </div>
  </div>
);

export default PatientOverview;