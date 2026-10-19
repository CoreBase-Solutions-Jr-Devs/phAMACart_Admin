import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import {
  Edit,
  Trash2,
  ChevronRight,
} from "lucide-react";

import { Category } from "@/features/categories/categoriesType";

import { CategoryFormDialog } from "./category-form-dialog";

/* =========================
   HIERARCHY TYPE
========================= */

type HierarchyCategory = Category & {
  depth?: number;
};

interface Props {
  onDelete: (id: string) => void;
}

export const categoryColumn = ({
  onDelete,
}: Props): ColumnDef<HierarchyCategory>[] => [
  {
    accessorKey: "name",

    header: "Category Name",

    cell: ({ row }) => {
      const category = row.original;

      const depth = category.depth ?? 0;

      const hasChildren =
        category.children &&
        category.children.length > 0;

      return (
        <div
          className="flex items-center min-w-[250px]"
          style={{
            paddingLeft: `${depth * 24}px`,
          }}
        >
          {/* TREE INDICATOR */}
          {depth > 0 && (
            <ChevronRight
              size={14}
              className="mr-1 text-muted-foreground"
            />
          )}

          {/* PARENT BADGE */}
          <div className="flex items-center gap-2">
            <span>{category.name}</span>

            {hasChildren && (
              <span className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground">
                Parent
              </span>
            )}
          </div>
        </div>
      );
    },
  },

  {
    id: "actions",

    header: "Actions",

    cell: ({ row }) => {
      const category = row.original;

      return (
        <div className="flex gap-2">
          {/* EDIT */}
          <CategoryFormDialog
            category={category}
          >
            <Button
              size="sm"
              variant="outline"
            >
              <Edit size={16} />
            </Button>
          </CategoryFormDialog>

          {/* DELETE */}
          <Button
            size="sm"
            variant="destructive"
            onClick={() =>
              onDelete(category.id)
            }
          >
            <Trash2 size={16} />
          </Button>
        </div>
      );
    },
  },
];