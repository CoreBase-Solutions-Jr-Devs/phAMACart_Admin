import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Product } from "@/features/products/productsAPI";
import { ProductFormDialog } from "./product-form-dialog";

interface Props {
  onDelete: (id: string) => void;
  categories: { id: string; name: string }[];
}

export const productsColumns = ({
  onDelete,
  categories,
}: Props): ColumnDef<Product>[] => [
  {
    accessorKey: "name",
    header: "Product",
  },
  {
    accessorKey: "categoryName",
    header: "Category",
  },
  {
    accessorKey: "brandName",
    header: "Brand",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.original.price;
      return <span>KES {price}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex gap-2">
          <ProductFormDialog product={product} categories={categories}>
            <Button size="sm" variant="outline">
              <Edit size={16} />
            </Button>
          </ProductFormDialog>

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