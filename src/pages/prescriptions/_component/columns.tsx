import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import {
  PendingPrescriptionDto,
  PrescriptionStatus,
} from "@/features/prescriptions/prescriptionsType";

interface PrescriptionColumnsProps {
  onView: (
    prescription: PendingPrescriptionDto
  ) => void;

  onApprove: (
    prescription: PendingPrescriptionDto
  ) => void;

  onReject: (
    prescription: PendingPrescriptionDto
  ) => void;

  isApproving?: boolean;
  isRejecting?: boolean;
}

const statusLabel = (
  status: PrescriptionStatus
) => {
  switch (status) {
    case PrescriptionStatus.Submitted:
      return "Submitted";

    case PrescriptionStatus.UnderReview:
      return "Under Review";

    case PrescriptionStatus.Approved:
      return "Approved";

    case PrescriptionStatus.Rejected:
      return "Rejected";

    case PrescriptionStatus.PartiallyApproved:
      return "Partially Approved";

    default:
      return "Unknown";
  }
};

export const prescriptionsColumns = ({
  onView,
}: PrescriptionColumnsProps): ColumnDef<PendingPrescriptionDto>[] => [
    {
      accessorKey: "fullName",
      header: "Patient",
    },

    {
      accessorKey: "cellphoneNumber",
      header: "Phone",
    },

    {
      accessorKey: "email",
      header: "Email",
    },

    {
      accessorKey: "nationalIdOrPatientNumber",
      header: "Patient / National ID",
    },

    {
      accessorKey: "doctorName",
      header: "Doctor",
    },

    {
      accessorKey: "issueDate",
      header: "Issue Date",
      cell: ({ row }) =>
        row.original.issueDate
          ? new Date(
            row.original.issueDate
          ).toLocaleDateString()
          : "-",
    },

    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
      cell: ({ row }) =>
        row.original.expiryDate
          ? new Date(
            row.original.expiryDate
          ).toLocaleDateString()
          : "-",
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) =>
        statusLabel(row.original.status),
    },

    {
      id: "actions",
      header: "",
      enableSorting: false,
      enableHiding: false,

      cell: ({ row }) => {
        const prescription = row.original;

        const canReview =
          prescription.status ===
          PrescriptionStatus.Submitted ||
          prescription.status ===
          PrescriptionStatus.UnderReview;

        if (!canReview) {
          return null;
        }

        return (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              title="View prescription"
              aria-label="View prescription"
              onClick={() =>
                onView(prescription)
              }
              className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];
