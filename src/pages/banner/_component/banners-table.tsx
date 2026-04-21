import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { bannerColumn } from "./columns";
import { useGetBannersQuery, useDeleteBannerMutation } from "@/features/banner/bannerAPI";
import { Banner } from "@/features/banner/bannerType";
import { BannerFormDialog } from "./banner-form-dialog";
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

const BannersTable = () => {
  const [filter, setFilter] = useState({
    search: "",
    pageNumber: 1,
    pageSize: 10,
  });

  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  /* =========================
     DATA
  ========================= */
  const { data, isFetching } = useGetBannersQuery();
  const [deleteBannerMutation, { isLoading: isDeleting }] = useDeleteBannerMutation();

  const banners = data?.banners || [];

  /* =========================
     PAGINATION
  ========================= */
  const pagination = {
    totalCount: banners.length,
    totalPages: Math.ceil(banners.length / filter.pageSize),
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
     EDIT
  ========================= */
  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
  };

  /* =========================
     DELETE
  ========================= */
  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteBannerMutation(pendingDeleteId).unwrap();
      toast.success("Banner deleted successfully.");
      setPendingDeleteId(null);
    } catch (err) {
      toast.error(parseError(err));
      setPendingDeleteId(null);
    }
  };

  /* =========================
     COLUMNS
  ========================= */
  const columns = bannerColumn({ onEdit: handleEdit, onDelete: handleDelete });

  return (
    <div className="space-y-4">
      {/* FILTERS */}
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Search Banner..."
          value={filter.search}
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              search: e.target.value,
              pageNumber: 1,
            }))
          }
          className="max-w-sm"
          disabled
        />
      </div>

      {/* TABLE */}
      <DataTable
        data={banners}
        columns={columns}
        isLoading={isFetching}
        selection={false}
        showSearch={false}
        emptyTitle="No banners found"
        isShowPagination={true}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* EDIT DIALOG */}
      <BannerFormDialog
        banner={selectedBanner ?? undefined}
        open={!!selectedBanner}
        onOpenChange={(open) => {
          if (!open) setSelectedBanner(null);
        }}
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
            <DialogTitle>Delete Banner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this banner? This action cannot
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

export default BannersTable;