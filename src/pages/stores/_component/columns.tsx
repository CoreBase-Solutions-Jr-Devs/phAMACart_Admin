import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Stores } from "@/features/stores/storesType";
import { StoreFormDialog } from "./store-form-dialog";
// import { CategoryFormDialog } from "./category-form-dialog";

interface Props {
  onDelete: (id: string) => void;
  // categories: { id: string; name: string }[];
}

export const storesColumn = ({ onDelete }: Props): ColumnDef<Stores>[] => [
  {
    accessorKey: "name",
    header: "StoreName",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "workingHours",
    header: "WorkingHours",
  },
  {
    accessorKey: "latitude",
    header: "Latitude",
  },
  {
    accessorKey: "longitude",
    header: "Longitude",
  },
  {
    accessorKey: "distanceKm",
    header: "DistanceKm",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const store = row.original;

      return (
        <div className="flex gap-2">
          <StoreFormDialog store={store}>
            <Button size="sm" variant="outline">
              <Edit size={16} />
            </Button>
          </StoreFormDialog>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(store.id)}
            disabled
          >
            <Trash2 size={16} />
          </Button>
        </div>
      );
    },
  },
];
