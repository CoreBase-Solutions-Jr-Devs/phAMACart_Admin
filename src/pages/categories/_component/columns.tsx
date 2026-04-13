import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Category } from "@/features/categories/categoriesType";
import { CategoryFormDialog } from "./category-form-dialog";

interface Props {
  onDelete: (id: string) => void;
  // categories: { id: string; name: string }[];
}

export const categoryColumn = ({ onDelete }: Props): ColumnDef<Category>[] => [
  {
    accessorKey: "name",
    header: "CategoryName",
  },
  // {
  //   accessorKey: "categoryName",
  //   header: "Category",
  // },
  // {
  //   accessorKey: "brandName",
  //   header: "Brand",
  // },
  // {
  //   accessorKey: "price",
  //   header: "Price",
  //   cell: ({ row }) => {
  //     const price = row.original.price;
  //     return <span>KES {price}</span>;
  //   },
  // },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const category = row.original;

      return (
        <div className="flex gap-2">
          <CategoryFormDialog category={category}>
            <Button size="sm" variant="outline">
              <Edit size={16} />
            </Button>
          </CategoryFormDialog>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(category.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      );
    },
  },
];
