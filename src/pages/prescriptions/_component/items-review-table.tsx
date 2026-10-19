import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Package, PillIcon, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import DecisionBadge from "./decision-badge";
import { PrescriptionItemDecision } from "@/features/prescriptions/prescriptionsType";

/* ===============================================================
   ItemsReviewTable
   -----------------------------------------------------------------
   Renders the configured item decisions as a table, or an empty
   state when none have been added yet. Purely presentational —
   removal is reported upward via onRemove(index).
=============================================================== */

interface ReviewTableItem {
  _id: string;
  productId: string;
  productName: string;
  authorizedQty: number;
  decision: PrescriptionItemDecision["decision"];
  substituteProductId: string | null;
  substituteProductName: string;
}

interface Props {
  itemDecisions: PrescriptionItemDecision[];
  itemNames: Record<string, string>;
  onRemove: (index: number) => void;
}

const ItemsReviewTable = ({ itemDecisions, itemNames, onRemove }: Props) => {
  const tableData: ReviewTableItem[] = useMemo(
    () =>
      itemDecisions.map((item, index) => {
        const substituteProductId = item.substituteProductId ?? null;
        return {
          _id: `${item.productId}-${index}`,
          productId: item.productId,
          productName: itemNames[item.productId] || item.productId,
          authorizedQty: item.authorizedQty,
          decision: item.decision,
          substituteProductId,
          substituteProductName: substituteProductId
            ? itemNames[substituteProductId] || substituteProductId
            : "",
        };
      }),
    [itemDecisions, itemNames]
  );

  const columns: ColumnDef<ReviewTableItem>[] = useMemo(
    () => [
      {
        accessorKey: "productName",
        header: "Product",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <PillIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">{item.productName}</p>
                <p className="truncate font-mono text-[11px] text-slate-400">{item.productId}</p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "authorizedQty",
        header: "Quantity",
        cell: ({ row }) => (
          <span className="font-semibold text-slate-800">{row.original.authorizedQty}</span>
        ),
      },
      {
        accessorKey: "decision",
        header: "Decision",
        cell: ({ row }) => <DecisionBadge value={row.original.decision} />,
      },
      {
        accessorKey: "substituteProductName",
        header: "Substitute Product",
        cell: ({ row }) => {
          const item = row.original;
          if (!item.substituteProductId) {
            return <span className="text-slate-300 font-medium">—</span>;
          }
          return (
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-800">{item.substituteProductName}</p>
              <p className="truncate font-mono text-[11px] text-slate-400">
                {item.substituteProductId}
              </p>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Action</div>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(row.index);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </Button>
          </div>
        ),
      },
    ],
    [onRemove]
  );

  if (itemDecisions.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Package className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-700">No items added to review</p>
          <p className="text-[11px] text-slate-400">
            Use the search controls above to add prescription item decisions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <DataTable
        data={tableData}
        columns={columns}
        showSearch={false}
        selection={false}
        isLoading={false}
        isShowPagination={false}
        emptyTitle="No items"
        className="rounded-none border-0 shadow-none [&>div]:rounded-none [&>div]:border-0"
      />
    </div>
  );
};

export default ItemsReviewTable;