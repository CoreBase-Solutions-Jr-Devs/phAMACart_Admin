import { useEffect, useRef, useState } from "react";
import {
  ChevronsUpDown,
  Loader2,
  Search,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { cn } from "@/lib/utils";

import {
  PrescriptionProductSearchResult,
} from "@/features/prescriptions/prescriptionsType";

import {
  useLazyGetProductsQuery,
} from "@/features/products/productsAPI";

interface Props {
  value: string;
  selectedName?: string;
  onSelect: (
    product: PrescriptionProductSearchResult
  ) => void;
  placeholder?: string;
  disabled?: boolean;
}

const DEBOUNCE_MS = 300;

const ProductSearchCombobox = ({
  value,
  selectedName,
  onSelect,
  placeholder = "Search products...",
  disabled = false,
}: Props) => {
  const [open, setOpen] = useState(false);

  const [query, setQuery] = useState(
    selectedName ?? ""
  );

  const [results, setResults] = useState<
    PrescriptionProductSearchResult[]
  >([]);

  const inputRef =
    useRef<HTMLInputElement>(null);

  const [
    searchProducts,
    { isFetching },
  ] = useLazyGetProductsQuery();

  /*
   * ---------------------------------------------------------
   * KEEP INPUT IN SYNC WITH SELECTED PRODUCT
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!open) {
      setQuery(selectedName ?? "");
    }
  }, [selectedName, open]);

  /*
   * ---------------------------------------------------------
   * PRODUCT SEARCH
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const searchTerm = query.trim();

    if (searchTerm.length < 2) {
      setResults([]);
      return;
    }

    let cancelled = false;

    const timer = window.setTimeout(async () => {
      try {
        const response =
          await searchProducts({
            pageIndex: 0,
            pageSize: 20,
            search: searchTerm,
            sortBy: "bestseller",
            onlyInStock: true,
            onlyPrescription: true,
          }).unwrap();

        if (cancelled) {
          return;
        }

        const products =
          response?.products?.data ?? [];

        const mapped: PrescriptionProductSearchResult[] =
          products.map((product) => ({
            productId: product.id,
            name: product.name,
            sku:
              product.thirdPartyId ??
              undefined,
            isAvailable:
              Number(
                product.availableStock ?? 0
              ) > 0,
            availableQuantity:
              Number(
                product.availableStock ?? 0
              ),
          }));

        setResults(mapped);
      } catch (error) {
        console.error(
          "Failed to search prescription products:",
          error
        );

        if (!cancelled) {
          setResults([]);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [
    query,
    open,
    searchProducts,
  ]);

  /*
   * ---------------------------------------------------------
   * OPEN / CLOSE
   * ---------------------------------------------------------
   */
  const handleOpenChange = (
    nextOpen: boolean
  ) => {
    if (disabled) {
      return;
    }

    setOpen(nextOpen);

    if (nextOpen) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    } else {
      setQuery(selectedName ?? "");
      setResults([]);
    }
  };

  /*
   * ---------------------------------------------------------
   * INPUT CHANGE
   * ---------------------------------------------------------
   */
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextValue = event.target.value;

    setQuery(nextValue);

    if (!open) {
      setOpen(true);
    }

    /*
     * If the user starts changing an existing
     * selection, the old selected product is no
     * longer considered selected.
     */
    if (
      value &&
      selectedName &&
      nextValue !== selectedName
    ) {
      setResults([]);
    }
  };

  /*
   * ---------------------------------------------------------
   * SELECT PRODUCT
   * ---------------------------------------------------------
   */
  const handleSelect = (
    product: PrescriptionProductSearchResult
  ) => {
    setQuery(product.name);
    setResults([]);
    setOpen(false);

    onSelect(product);
  };

  /*
   * ---------------------------------------------------------
   * KEYBOARD
   * ---------------------------------------------------------
   */
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Escape") {
      setOpen(false);
      setQuery(selectedName ?? "");
      setResults([]);
    }
  };

  const hasSearchTerm =
    query.trim().length >= 2;

  return (
    <Popover
      open={open}
      onOpenChange={handleOpenChange}
    >
      <PopoverTrigger asChild>
        <div className="relative w-full">
          {/* Search icon */}
          <Search
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              z-10
              h-4
              w-4
              -translate-y-1/2
              text-slate-400
            "
          />

          {/* =================================================
              THIS IS THE ONLY SEARCH INPUT
          ================================================= */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete="off"
            onFocus={() => {
              if (!disabled) {
                setOpen(true);
              }
            }}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={cn(
              "h-10 w-full rounded-md border",
              "border-slate-200 bg-white",
              "pl-9 pr-9 text-sm",
              "text-slate-900",
              "outline-none",
              "placeholder:text-slate-400",
              "focus:border-slate-400",
              "focus:ring-2 focus:ring-slate-200",
              "disabled:cursor-not-allowed",
              "disabled:opacity-50"
            )}
          />

          {/* Chevron */}
          <ChevronsUpDown
            className="
              pointer-events-none
              absolute
              right-3
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-slate-400
            "
          />
        </div>
      </PopoverTrigger>

      {/* =====================================================
          PRODUCT RESULTS
      ===================================================== */}
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={4}
        className="
          z-[100]
          w-[--radix-popover-trigger-width]
          min-w-[320px]
          overflow-hidden
          p-0
        "
      >
        <Command
          shouldFilter={false}
          className="w-full"
        >
          <CommandList className="max-h-[320px]">
            {/* LOADING */}
            {isFetching && (
              <div className="flex items-center justify-center gap-2 py-6">
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />

                <span className="text-xs text-slate-500">
                  Searching products...
                </span>
              </div>
            )}

            {/* INITIAL STATE */}
            {!isFetching &&
              !hasSearchTerm && (
                <div className="px-4 py-6 text-center">
                  <Search className="mx-auto mb-2 h-5 w-5 text-slate-300" />

                  <p className="text-sm font-medium text-slate-700">
                    Search products
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Type at least 2 characters.
                  </p>
                </div>
              )}

            {/* NO RESULTS */}
            {!isFetching &&
              hasSearchTerm &&
              results.length === 0 && (
                <CommandEmpty className="py-6 text-center">
                  <p className="text-sm font-medium text-slate-700">
                    No prescription products found
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Try another product name or SKU.
                  </p>
                </CommandEmpty>
              )}

            {/* RESULTS */}
            {!isFetching &&
              results.length > 0 &&
              results.map((product) => (
                <CommandItem
                  key={product.productId}
                  value={product.productId}
                  onSelect={() =>
                    handleSelect(product)
                  }
                  className="
                    cursor-pointer
                    px-3
                    py-3
                  "
                >
                  <div className="flex w-full items-center justify-between gap-4">
                    {/* Product information */}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {product.name}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {product.sku
                          ? `${product.sku} · `
                          : ""}
                        {product.productId}
                      </p>
                    </div>

                    {/* Available stock */}
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-1",
                        "text-xs font-medium",
                        product.availableQuantity >
                          0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      {product.availableQuantity}{" "}
                      available
                    </span>
                  </div>
                </CommandItem>
              ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProductSearchCombobox;
