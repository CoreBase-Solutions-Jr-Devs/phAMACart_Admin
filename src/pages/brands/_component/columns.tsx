import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Brand } from "@/features/brands/brandsType";
import { BrandFormDialog } from "./brand-form-dialog";

interface Props {
  onDelete: (id: string) => void;
  // categories: { id: string; name: string }[];
}

export const brandColumn = ({ onDelete }: Props): ColumnDef<Brand>[] => [
  {
    accessorKey: "name",
    header: "BrandName",
  },
  // {
  //   accessorKey: "categoryName",
  //   header: "Category",
  // },
  // {
  //   accessorKey: "brandName",
  //   header: "Brand",
  // },
  {
    accessorKey: "productCount",
    header: "ProductCount",
    cell: ({ row }) => {
      const productCount = row.original.productCount;
      return <span>{productCount}</span>;
    },
  },
  {
    accessorKey: "isActive",
    header: "IsActive",
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return <input type="checkbox" checked={isActive} disabled />;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const brand = row.original;

      return (
        <div className="flex gap-2">
          <BrandFormDialog brand={brand}>
            <Button size="sm" variant="outline" disabled>
              <Edit size={16} />
            </Button>
          </BrandFormDialog>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(brand.id)}
            disabled
          >
            <Trash2 size={16} />
          </Button>
        </div>
      );
    },
  },
];
