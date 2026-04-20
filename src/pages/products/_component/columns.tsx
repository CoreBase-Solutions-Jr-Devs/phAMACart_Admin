import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Product } from "@/features/products/productsAPI";

interface Props {
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
}

export const productsColumns = ({
  onDelete,
  onEdit,
}: Props): ColumnDef<Product>[] => [
  /* =========================
     BASIC INFO
  ========================= */

  {
    accessorKey: "name",
    header: "Product Name",
  },
  /* =========================
     CATEGORY / BRAND
  ========================= */

  {
    accessorKey: "categoryName",
    header: "Category",
    cell: ({ row }) => (
      <span>{row.original.categoryName ?? "No Category"}</span>
    ),
  },
  {
    accessorKey: "brandName",
    header: "Brand",
    cell: ({ row }) => (
      <span>{row.original.brandName ?? "No Brand"}</span>
    ),
  },

  /* =========================
     PRICING
  ========================= */

  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <span className="font-medium">KES {row.original.price}</span>
    ),
  },

  /* =========================
     IMAGE
  ========================= */

  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) =>
      row.original.imageUrl ? (
        <img
          src={row.original.imageUrl}
          alt={row.original.name}
          className="h-10 w-10 rounded object-cover"
        />
      ) : (
        <span className="text-muted-foreground">No Image</span>
      ),
  },

  /* =========================
     FLAGS
  ========================= */

  {
    accessorKey: "isPrescription",
    header: "Prescription",
    cell: ({ row }) => (
      <span>
        {row.original.isPrescription ? "Required" : "No"}
      </span>
    ),
  },
  /* =========================
     ACTIONS
  ========================= */

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(product)}
          >
            <Edit size={16} />
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      );
    },
  },
];