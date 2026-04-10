import { useState } from "react";
import { DataTable } from "@/components/data-table";

import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/features/products/productsAPI";

import { useGetCategoriesTreeQuery } from "@/features/categories/categoriesAPI";

import { productsColumns } from "./columns";
import { Input } from "@/components/ui/input";
import { PriceSlider } from "@/components/ui/price-slider";
import CategoryTreeCombobox from "@/components/categories/CategoryTreeCombobox";

const ProductsTable = () => {
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

  const { data, isFetching } = useGetProductsQuery({
    search: filter.search,
    category: filter.categoryId || undefined,
    brand: filter.brand || undefined,
    minPrice: filter.minPrice,
    maxPrice: filter.maxPrice,
    pageIndex: filter.pageNumber - 1,
    pageSize: filter.pageSize,
  });

  const { data: categoriesData } = useGetCategoriesTreeQuery();

  const [deleteProductMutation] = useDeleteProductMutation();

  const products = data?.products.data || [];
  const categories = categoriesData?.categories || [];

  /* =========================
     PAGINATION
  ========================= */

  const pagination = {
    totalCount: data?.products.count || 0,
    totalPages: Math.ceil((data?.products.count || 0) / filter.pageSize),
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
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProductMutation(id);
    }
  };

  /* =========================
     BRANDS
  ========================= */

  const brands = Array.from(
    new Set(products.map((p) => p.brandName).filter((b): b is string => !!b))
  );

  /* =========================
     COLUMNS
  ========================= */

  const columns = productsColumns({
    onDelete: handleDelete,
    categories,
  });

  return (
    <div className="space-y-4">
      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Search products..."
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

        {/* CATEGORY */}
        <CategoryTreeCombobox
          categories={categories}
          value={filter.categoryId}
          onChange={(value) =>
            setFilter((prev) => ({
              ...prev,
              categoryId: value,
              pageNumber: 1,
            }))
          }
        />

        {/* BRAND */}
        <select
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
        </select>

        {/* PRICE */}
        <div className="w-64">
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
        </div>
      </div>

      {/* TABLE */}
      <DataTable
        data={products}
        columns={columns}
        isLoading={isFetching}
        selection={false}
        showSearch={false}
        emptyTitle="No products found"
        isShowPagination={true}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default ProductsTable;