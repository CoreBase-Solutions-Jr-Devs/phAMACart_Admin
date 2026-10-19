import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table";

import {
  useApprovePrescriptionMutation,
  useGetPendingPrescriptionsQuery,
  useRejectPrescriptionMutation,
  useTranscribePrescriptionDetailsMutation,
} from "@/features/prescriptions/prescriptionsAPI";

import {
  PendingPrescriptionDto,
  PrescriptionItemDecision,
  RejectionReason,
} from "@/features/prescriptions/prescriptionsType";

import { prescriptionsColumns } from "./columns";
import useAuth from "@/hooks/use-auth";
import PrescriptionDetailsDialog, {
  TranscribeDetails,
} from "./prescription-details-dialog";
import { parseError } from "@/lib/parse-error";
const PrescriptionsTable = () => {
  const [selected, setSelected] = useState<PendingPrescriptionDto | null>(null);
  const [open, setOpen] = useState(false);

  const { data, isLoading, isFetching, refetch } = useGetPendingPrescriptionsQuery({
    pageNumber: 1,
    pageSize: 50,
  });

  const { data: currentUserData } = useAuth();

  const [approvePrescription, { isLoading: isApproving }] =
    useApprovePrescriptionMutation();

  const [rejectPrescription, { isLoading: isRejecting }] =
    useRejectPrescriptionMutation();

  const [transcribeDetails, { isLoading: isTranscribing }] =
    useTranscribePrescriptionDetailsMutation();

  const pharmacistUserId = currentUserData?.user?.id;

  const handleView = (prescription: PendingPrescriptionDto) => {
    setSelected(prescription);
    setOpen(true);
  };

  /*
   * ---------------------------------------------------------
   * TRANSCRIBE
   * ---------------------------------------------------------
   */
  const handleTranscribe = async (
    prescription: PendingPrescriptionDto,
    details: TranscribeDetails
  ) => {
    if (!pharmacistUserId) {
      toast.error("Unable to identify the current pharmacist.");
      return;
    }

    try {
      await transcribeDetails({
        prescriptionId: prescription.id,
        pharmacistUserId,
        ...details,
      }).unwrap();

      toast.success("Prescription details saved.");
      await refetch();
    } catch (error: any) {
      console.error("Failed to save prescription details:", error);
      toast.error(parseError(error));
    }
  };

  /*
   * ---------------------------------------------------------
   * APPROVE
   * ---------------------------------------------------------
   */
  const handleApprove = async (
    prescription: PendingPrescriptionDto,
    itemDecisions: PrescriptionItemDecision[]
  ) => {
    if (!pharmacistUserId) {
      toast.error("Unable to identify the current pharmacist.");
      return;
    }

    if (itemDecisions.length === 0) {
      toast.error("Add at least one prescription item.");
      return;
    }

    try {
      await approvePrescription({
        prescriptionId: prescription.id,
        pharmacistUserId,
        itemDecisions,
      }).unwrap();

      toast.success("Prescription approved successfully.");
      setOpen(false);
      setSelected(null);

      await refetch();
    } catch (error: any) {
      console.error("Failed to approve prescription:", error);
      toast.error(parseError(error));
    }
  };

  /*
   * ---------------------------------------------------------
   * REJECT
   * ---------------------------------------------------------
   */
  const handleReject = async (
    prescription: PendingPrescriptionDto,
    reason: RejectionReason,
    notes: string | null
  ) => {
    if (!pharmacistUserId) {
      toast.error("Unable to identify the current pharmacist.");
      return;
    }

    try {
      await rejectPrescription({
        prescriptionId: prescription.id,
        pharmacistUserId,
        reason,
        notes,
      }).unwrap();

      toast.success("Prescription rejected.");
      setOpen(false);
      setSelected(null);

      await refetch();
    } catch (error: any) {
      console.error("Failed to reject prescription:", error);
      toast.error(parseError(error));
    }
  };

  const columns = useMemo(
    () =>
      prescriptionsColumns({
        onView: handleView,

        onApprove: (prescription) => {
          handleView(prescription);
        },

        onReject: (prescription) => {
          handleView(prescription);
        },

        isApproving,
        isRejecting,
      }),
    [isApproving, isRejecting]
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading || isFetching}
      />

      <PrescriptionDetailsDialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);

          if (!value) {
            setSelected(null);
          }
        }}
        prescription={selected}
        onTranscribe={handleTranscribe}
        onApprove={handleApprove}
        onReject={handleReject}
        isTranscribing={isTranscribing}
        isApproving={isApproving}
        isRejecting={isRejecting}
      />
    </>
  );
};

export default PrescriptionsTable;