import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Banner } from "@/features/banner/bannerType";
import { BannerFormDialog } from "./banner-form-dialog";

interface Props {
  onDelete: (id: string) => void;
  // categories: { id: string; name: string }[];
}

export const bannerColumn = ({ onDelete }: Props): ColumnDef<Banner>[] => [
  {
    accessorKey: "title",
    header: "BannerName",
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
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      return <span>{type}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const banner = row.original;

      return (
        <div className="flex gap-2">
          <BannerFormDialog banner={banner}>
            <Button size="sm" variant="outline">
              <Edit size={16} />
            </Button>
          </BannerFormDialog>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(banner.id)}
            disabled
          >
            <Trash2 size={16} />
          </Button>
        </div>
      );
    },
  },
];
