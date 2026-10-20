import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";

import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useTriggerProductSyncMutation,
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
import { ChevronDownIcon, FileSpreadsheet, FolderInput, X } from "lucide-react";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { BulkCategoryDialog } from "./bulk-category-dialog";
import { ImportDataDialog } from "./import-data-dialog";
import { toast } from "sonner";

import { Product } from "@/features/products/productsType";
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
    maxPrice: 10000,
    category: "",
    brand: "",
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [bulkOpen, setBulkOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  // ─────────────────────────────────────────────────────────────────────
  // DATA
  // ─────────────────────────────────────────────────────────────────────

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

  const [triggerSync, { isLoading: isSyncing }] =
    useTriggerProductSyncMutation();

  const products = useMemo(
    () => (data?.products.data || []).map((p) => ({ ...p, _id: p.id })),
    [data]
  );
  const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
  const leafCategories = leafCategoriesData?.categories || [];
  const brands = brandsData?.brands?.data || [];

  // ─────────────────────────────────────────────────────────────────────
  // SYNC
  // ─────────────────────────────────────────────────────────────────────

  const handleSyncProducts = async () => {
    try {
      const res = await triggerSync().unwrap();

      toast.success(res.message || "Product sync started");
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  // ─────────────────────────────────────────────────────────────────────
  // PAGINATION
  // ─────────────────────────────────────────────────────────────────────

  const pagination = {
    totalItems: data?.products.count || 0,
    totalPages: Math.ceil(
      (data?.products.count || 0) / filter.pageSize
    ),
    pageNumber: filter.pageNumber,
    pageSize: filter.pageSize,
  };

  const handlePageChange = (pageNumber: number) => {
    setFilter((prev) => ({
      ...prev,
      pageNumber,
    }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilter((prev) => ({
      ...prev,
      pageSize,
      pageNumber: 1,
    }));
  };

  // ─────────────────────────────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────────────────────────────

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

  // ─────────────────────────────────────────────────────────────────────
  // EDIT
  // ─────────────────────────────────────────────────────────────────────

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeEdit = () => {
    setSelectedProduct(null);
  };

  // ─────────────────────────────────────────────────────────────────────
  // COLUMNS
  // ─────────────────────────────────────────────────────────────────────

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            aria-label="Select page"
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : false
            }
            onCheckedChange={(checked) =>
              table.toggleAllPageRowsSelected(checked === true)
            }
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            aria-label="Select product"
            checked={row.getIsSelected()}
            onClick={(e) => e.stopPropagation()}
            onCheckedChange={(checked) => row.toggleSelected(checked === true)}
          />
        ),
      },
      ...productsColumns({
        onDelete: handleDelete,
        onEdit: handleEdit,
      }),
    ],
    [products]
  );

  // ─────────────────────────────────────────────────────────────────────
  // FILTER LABELS
  // ─────────────────────────────────────────────────────────────────────

  const selectedCategoryName = filter.category
    ? leafCategories.find(
      (category) => category.name === filter.category
    )?.name ?? filter.category
    : null;

  const selectedBrandName = filter.brand
    ? brands.find(
      (brand: any) => brand.name === filter.brand
    )?.name ?? filter.brand
    : null;

  return (
    <div className="w-full space-y-4">
      {/* ─────────────────────────────────────────────────────────────── */}
      {/* ACTIONS */}
      {/* ─────────────────────────────────────────────────────────────── */}

      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleSyncProducts}
            disabled={isSyncing}
            className="shrink-0"
          >
            {isSyncing ? "Syncing..." : "Sync Products Now"}
          </Button>
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            <FileSpreadsheet className="size-4" />
            Import descriptions
          </Button>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-1.5 text-sm">
            <span className="font-medium">{selectedIds.length} selected</span>
            <Button size="sm" onClick={() => setBulkOpen(true)}>
              <FolderInput className="size-4" />
              Assign category
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setRowSelection({})}
              aria-label="Clear selection"
            >
              <X className="size-4" />
            </Button>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* FILTERS */}
      {/* ─────────────────────────────────────────────────────────────── */}

      <div
        className="
          grid w-full items-center gap-3
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-[minmax(220px,1.5fr)_minmax(150px,1fr)_minmax(150px,1fr)]
          xl:grid-cols-[minmax(280px,1.5fr)_160px_160px_260px]
        "
      >
        {/* SEARCH */}
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
          className="w-full"
        />

        {/* CATEGORY */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between"
            >
              <span className="truncate">
                {selectedCategoryName ?? "All Categories"}
              </span>

              <ChevronDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>
              Category
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={() =>
                setFilter((prev) => ({
                  ...prev,
                  category: "",
                  pageNumber: 1,
                }))
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
            <Button
              variant="outline"
              className="w-full justify-between"
            >
              <span className="truncate">
                {selectedBrandName ?? "All Brands"}
              </span>

              <ChevronDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>
              Brand
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={() =>
                setFilter((prev) => ({
                  ...prev,
                  brand: "",
                  pageNumber: 1,
                }))
              }
            >
              All Brands
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {brands.map((brand: any) => (
              <DropdownMenuItem
                key={brand.id}
                onSelect={() =>
                  setFilter((prev) => ({
                    ...prev,
                    brand: brand.name,
                    pageNumber: 1,
                  }))
                }
              >
                {brand.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* PRICE */}
        <div className="w-full min-w-0">
          <div className="mb-1 text-xs font-medium text-muted-foreground">
            Price Range
          </div>

          <PriceSlider
            min={0}
            max={10000}
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

          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>
              KES {filter.minPrice.toLocaleString()}
            </span>

            <span>
              KES {filter.maxPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* TABLE */}
      {/* ─────────────────────────────────────────────────────────────── */}

      <div className="w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <DataTable
            data={products}
            columns={columns}
            isLoading={isFetching}
            selection={true}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            showSearch={false}
            emptyTitle="No products found"
            isShowPagination={true}
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* EDIT DIALOG */}
      {/* ─────────────────────────────────────────────────────────────── */}

      <BulkCategoryDialog
        open={bulkOpen}
        productIds={selectedIds}
        categories={leafCategories}
        onOpenChange={setBulkOpen}
        onDone={() => {
          setBulkOpen(false);
          setRowSelection({});
        }}
      />

      <ImportDataDialog open={importOpen} onOpenChange={setImportOpen} />

      <ProductFormDialog
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => {
          if (!open) {
            closeEdit();
          }
        }}
      />

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* DELETE CONFIRMATION */}
      {/* ─────────────────────────────────────────────────────────────── */}

      <Dialog
        open={!!pendingDeleteId}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDeleteId(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete Product
            </DialogTitle>

            <DialogDescription>
              Are you sure you want to delete this product?
              This action cannot be undone.
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