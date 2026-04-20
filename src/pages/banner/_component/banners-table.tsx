import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { bannerColumn } from "./columns";
import { useGetBannersQuery } from "@/features/banner/bannerAPI";
import { Banner } from "@/features/banner/bannerType";
import { BannerFormDialog } from "./banner-form-dialog";

const BannersTable = () => {
  const [filter, setFilter] = useState({
    search: "",
    pageNumber: 1,
    pageSize: 10,
  });

  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

  /* =========================
     DATA
  ========================= */
  const { data, isFetching } = useGetBannersQuery();

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
     COLUMNS
  ========================= */
  const columns = bannerColumn({ onEdit: handleEdit });

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
    </div>
  );
};

export default BannersTable;