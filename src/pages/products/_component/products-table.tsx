import { useState, useMemo } from "react";
import { DataTable } from "@/components/data-table";

import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/features/products/productsAPI";

import { useGetLeafCategoriesQuery } from "@/features/categories/categoriesAPI";
import { useGetBrandsQuery } from "@/features/brands/brandsAPI";

import { productsColumns } from "./columns";
import { Input } from "@/components/ui/input";
import { PriceSlider } from "@/components/ui/price-slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";

import { Product } from "@/features/products/productsAPI";
import { ProductFormDialog } from "./product-form-dialog";
import { parseError } from "@/lib/parse-error";

type FilterState = {
  search: string;
  pageNumber: number;
  pageSize: number;
  minPrice: number;
  maxPrice: number;
  category: string;
  brand: string;
};

const ProductsTable = () => {
  const [filter, setFilter] = useState<FilterState>({
    search: "",
    pageNumber: 1,
    pageSize: 10,
    minPrice: 0,
    maxPrice: 2000,
    category: "",
    brand: "",
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  /* =========================
     DATA
  ========================= */
  const { data, isFetching } = useGetProductsQuery({
    search: filter.search,
    category: filter.category || undefined,
    brand: filter.brand || undefined,
    minPrice: filter.minPrice,
    maxPrice: filter.maxPrice,
    pageIndex: filter.pageNumber - 1,
    pageSize: filter.pageSize,
  });

  const { data: leafCategoriesData } = useGetLeafCategoriesQuery();
  const { data: brandsData } = useGetBrandsQuery({
    pageIndex: 0,
    pageSize: 1000,
  });

  const [deleteProductMutation, { isLoading: isDeleting }] =
    useDeleteProductMutation();

  const products = data?.products.data || [];
  const leafCategories = leafCategoriesData?.categories || [];
  const brands = brandsData?.brands?.data || [];

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
  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteProductMutation(pendingDeleteId).unwrap();
      toast.success("Product deleted successfully.");
      setPendingDeleteId(null);
    } catch (err) {
      toast.error(parseError(err));
      setPendingDeleteId(null);
    }
  };

  /* =========================
     EDIT
  ========================= */
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeEdit = () => {
    setSelectedProduct(null);
  };

  /* =========================
     COLUMNS
  ========================= */
  const columns = useMemo(
    () =>
      productsColumns({
        onDelete: handleDelete,
        onEdit: handleEdit,
      }),
    [filter, products]
  );

  /* =========================
     FILTER LABELS
  ========================= */
  const selectedCategoryName = filter.category
    ? leafCategories.find((c) => c.name === filter.category)?.name ?? filter.category
    : null;

  const selectedBrandName = filter.brand
    ? brands.find((b: any) => b.name === filter.brand)?.name ?? filter.brand
    : null;

  return (
    <div className="space-y-4">

      {/* ================= FILTERS ================= */}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[160px] justify-between">
              {selectedCategoryName ?? "All Categories"}
              <ChevronDownIcon className="size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Category</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={() =>
                setFilter((prev) => ({ ...prev, category: "", pageNumber: 1 }))
              }
            >
              All Categories
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {leafCategories.map((category) => (
              <DropdownMenuItem
                key={category.id}
                onSelect={() =>
                  setFilter((prev) => ({
                    ...prev,
                    category: category.name,
                    pageNumber: 1,
                  }))
                }
              >
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* BRAND */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[160px] justify-between">
              {selectedBrandName ?? "All Brands"}
              <ChevronDownIcon className="size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Brand</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={() =>
                setFilter((prev) => ({ ...prev, brand: "", pageNumber: 1 }))
              }
            >
              All Brands
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {brands.map((b: any) => (
              <DropdownMenuItem
                key={b.id}
                onSelect={() =>
                  setFilter((prev) => ({
                    ...prev,
                    brand: b.name,
                    pageNumber: 1,
                  }))
                }
              >
                {b.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

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

      {/* ================= TABLE ================= */}
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

      {/* ================= EDIT DIALOG ================= */}
      <ProductFormDialog
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => {
          if (!open) closeEdit();
        }}
      />

      {/* ================= DELETE CONFIRM DIALOG ================= */}
      <Dialog
        open={!!pendingDeleteId}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot
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

export default ProductsTable;