import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Banner } from "@/features/banner/bannerType";

const getBannerTypeLabel = (type: any) => {
  switch (type) {
    case 0:
    case "0":
      return "Occasional";
    case 1:
    case "1":
      return "Promotional";
    case 2:
    case "2":
      return "Fixed";
    default:
      return "Unknown";
  }
};

const formatDate = (date?: Date | string) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

interface BannerColumnOptions {
  onEdit: (banner: Banner) => void;
}

export const bannerColumn = ({ onEdit }: BannerColumnOptions): ColumnDef<Banner>[] => [
  /* =========================
     IMAGE
  ========================= */
  {
    id: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.original.imageUrl;
      return image ? (
        <img
          src={image}
          alt={row.original.title}
          className="h-12 w-12 object-cover rounded-md border"
        />
      ) : (
        <span className="text-gray-400 text-sm">No image</span>
      );
    },
  },

  /* =========================
     TITLE
  ========================= */
  {
    accessorKey: "title",
    header: "Banner Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
    ),
  },

  /* =========================
     TYPE
  ========================= */
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="px-2 py-1 text-xs rounded bg-gray-100">
        {getBannerTypeLabel(row.original.type)}
      </span>
    ),
  },

  /* =========================
     START DATE
  ========================= */
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => formatDate(row.original.startDate),
  },

  /* =========================
     END DATE
  ========================= */
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => formatDate(row.original.endDate),
  },

  /* =========================
     SORT ORDER
  ========================= */
  {
    accessorKey: "sortOrder",
    header: "Sort Order",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.sortOrder}</span>
    ),
  },

  /* =========================
     ACTIONS
  ========================= */
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        size="sm"
        variant="outline"
        onClick={() => onEdit(row.original)}
      >
        <Edit size={16} />
      </Button>
    ),
  },
];