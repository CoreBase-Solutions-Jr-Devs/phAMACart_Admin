import { useState } from "react";
import { DataTable } from "@/components/data-table";

import {
  useDeleteCategoryMutation,
  useGetCategoriesFlatQuery,
} from "@/features/categories/categoriesAPI";
import { categoryColumn } from "./columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { parseError } from "@/lib/parse-error";

const CategoriesTable = () => {
  const [filter, setFilter] = useState({
    search: "",
    pageNumber: 1,
    pageSize: 20,
    minPrice: 0,
    maxPrice: 2000,
    categoryId: "",
    brand: "",
  });

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  /* =========================
     DATA
  ========================= */

  const { data: categoriesData, isFetching } = useGetCategoriesFlatQuery();

  const [deleteCategoryMutation, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const categories = categoriesData?.categories || [];

  /* =========================
     PAGINATION
  ========================= */

  const pagination = {
    totalCount: categories.length || 0,
    totalPages: Math.ceil((categories.length || 0) / filter.pageSize),
    pageNumber: filter.pageNumber,
    pageSize: filter.pageSize,
  };

  const handlePageChange = (pageNumber: number) => {
    setFilter((prev) => ({ ...prev, pageNumber }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilter((prev) => ({ ...prev, pageSize, pageNumber: 1 }));
  };

  /* =========================
     DELETE
  ========================= */

  // Called by the table row — opens the confirm dialog
  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  // Called when the user confirms inside the dialog
  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteCategoryMutation(pendingDeleteId).unwrap();
      toast.success("Category deleted successfully.");
      setPendingDeleteId(null);
    } catch (err) {
      toast.error(parseError(err));
      setPendingDeleteId(null);
    }
  };

  /* =========================
     COLUMNS
  ========================= */

  const columns = categoryColumn({
    onDelete: handleDelete,
  });

  return (
    <div className="space-y-4">
      {/* FILTERS */}
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Search Category..."
          value={filter.search}
          disabled
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              search: e.target.value,
              pageNumber: 1,
            }))
          }
          className="max-w-sm"
        />
      </div>

      {/* TABLE */}
      <DataTable
        data={categories}
        columns={columns}
        isLoading={isFetching}
        selection={false}
        showSearch={false}
        emptyTitle="No Categories found"
        isShowPagination={true}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* DELETE CONFIRM DIALOG */}
      <Dialog
        open={!!pendingDeleteId}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPendingDeleteId(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesTable;