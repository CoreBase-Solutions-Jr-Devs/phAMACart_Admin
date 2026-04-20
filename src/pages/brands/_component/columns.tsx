import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Brand } from "@/features/brands/brandsType";
import { UpdateBrandFormDialog } from "./update-brand-form-dialog";

export const brandColumn = (): ColumnDef<Brand>[] => [
  {
    accessorKey: "name",
    header: "Brand Name",
  },
  {
    accessorKey: "productCount",
    header: "Products",
    cell: ({ row }) => {
      return <span>{row.original.productCount}</span>;
    },
  },
  {
    accessorKey: "brandImageUrl",
    header: "Image",
    cell: ({ row }) => (
      <img
        src={row.original.brandImageUrl}
        className="h-10 w-10 object-contain"
      />
    ),
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => {
      return (
        <input
          type="checkbox"
          checked={row.original.isActive}
          disabled
        />
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const brand = row.original;

      return (
        <div className="flex gap-2">
          <UpdateBrandFormDialog brand={brand}>
            <Button size="sm" variant="outline">
              <Edit size={16} />
            </Button>
          </UpdateBrandFormDialog>
        </div>
      );
    },
  },
];