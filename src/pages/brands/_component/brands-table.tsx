import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { brandColumn } from "./columns";
import { Input } from "@/components/ui/input";
import { useGetBrandsQuery } from "@/features/brands/brandsAPI";

const BrandsTable = () => {
  const [filter, setFilter] = useState({
    search: "",
    pageNumber: 1,
    pageSize: 10,
  });

  /* =========================
     DATA
  ========================= */
  const { data, isFetching } = useGetBrandsQuery({
    pageIndex: filter.pageNumber - 1,
    pageSize: filter.pageSize,
  });

  /* =========================
     PAGINATION
  ========================= */
  const pagination = {
    totalCount: data?.brands?.count || 0,
    totalPages: Math.ceil((data?.brands?.count || 0) / filter.pageSize),
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
     DATA
  ========================= */
  const brands = data?.brands?.data || [];

  /* =========================
     COLUMNS
  ========================= */
  const columns = brandColumn();

  return (
    <div className="space-y-4">
      {/* FILTER */}
      <Input
        placeholder="Search Brand..."
        value={filter.search}
        onChange={(e) =>
          setFilter((prev) => ({
            ...prev,
            search: e.target.value,
            pageNumber: 1,
          }))
        }
        className="max-w-sm"
      />

      {/* TABLE */}
      <DataTable
        data={brands}
        columns={columns}
        isLoading={isFetching}
        selection={false}
        showSearch={false}
        emptyTitle="No brands found"
        isShowPagination={true}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default BrandsTable;