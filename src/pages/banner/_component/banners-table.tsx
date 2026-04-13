import { useState } from "react";
import { DataTable } from "@/components/data-table";

import { useDeleteCategoryMutation } from "@/features/categories/categoriesAPI";
// import { categoryColumn } from "./columns";
import { Input } from "@/components/ui/input";
import { bannerColumn } from "./columns";
import { useGetBannersQuery } from "@/features/banner/bannerAPI";
// import { PriceSlider } from "@/components/ui/price-slider";
// import CategoryTreeCombobox from "@/components/categories/CategoryTreeCombobox";

const BannersTable = () => {
  const [filter, setFilter] = useState({
    search: "",
    pageNumber: 1,
    pageSize: 10,
    minPrice: 0,
    maxPrice: 2000,
    categoryId: "",
    brand: "",
  });

  /* =========================
     DATA
  ========================= */

  // const { data, isFetching } = useGetProductsQuery({
  //   search: filter.search,
  //   category: filter.categoryId || undefined,
  //   brand: filter.brand || undefined,
  //   minPrice: filter.minPrice,
  //   maxPrice: filter.maxPrice,
  //   pageIndex: filter.pageNumber - 1,
  //   pageSize: filter.pageSize,
  // });

  const { data, isFetching } = useGetBannersQuery();

  const [deleteCategoryMutation] = useDeleteCategoryMutation();

  // const products = data?.products.data || [];
  // const categories = categoriesData?.categories || [];

  /* =========================
     PAGINATION
  ========================= */

  const pagination = {
    totalCount: data?.banners?.length || 0,
    totalPages: Math.ceil((data?.banners?.length || 0) / filter.pageSize),
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

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this Category?")) {
      await deleteCategoryMutation(id);
    }
  };

  /* =========================
     BANNERS
  ========================= */

  const banners = data?.banners || [];

  /* =========================
     COLUMNS
  ========================= */

  const columns = bannerColumn({
    onDelete: handleDelete,
    // categories,
  });

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

        {/* CATEGORY */}
        {/* <CategoryTreeCombobox
          categories={categories}
          value={filter.categoryId}
          onChange={(value) =>
            setFilter((prev) => ({
              ...prev,
              categoryId: value,
              pageNumber: 1,
            }))
          }
        /> */}

        {/* BRAND */}
        {/* <select
          value={filter.brand}
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              brand: e.target.value,
              pageNumber: 1,
            }))
          }
          className="border rounded px-2 py-1"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select> */}

        {/* PRICE */}
        {/* <div className="w-64">
          <PriceSlider
            min={0}
            max={2000}
            step={10}
            value={[filter.minPrice, filter.maxPrice]}
            onChange={([min, max]) =>
              setFilter((prev) => ({
                ...prev,
                minPrice: min,
                maxPrice: max,
                pageNumber: 1,
              }))
            }
          />
          <div className="flex justify-between text-xs mt-1">
            <span>{filter.minPrice}</span>
            <span>{filter.maxPrice}</span>
          </div>
        </div> */}
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
    </div>
  );
};

export default BannersTable;
