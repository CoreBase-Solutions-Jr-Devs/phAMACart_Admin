import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { X, ImageIcon, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Product,
  useUpdateProductMutation,
} from "@/features/products/productsAPI";

import { useGetBrandsQuery } from "@/features/brands/brandsAPI";

/* =========================
   SCHEMA
========================= */
const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  brandName: z.string().max(100).optional(),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().max(1000).optional(),
  removeMainImage: z.boolean(),
  removeAllImages: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  product: Product;
  categories: { id: string; name: string }[];
  children: React.ReactNode;
}

export const ProductFormDialog = ({
  product,
  categories,
  children,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  /* =========================
     BRANDS (PAGINATED + DYNAMIC)
  ========================= */
  const [brandQuery, setBrandQuery] = useState({
    pageIndex: 0,
    pageSize: 50,
    search: "",
  });

  const { data: brandsData, isFetching: brandsLoading } = useGetBrandsQuery({
    pageIndex: brandQuery.pageIndex,
    pageSize: brandQuery.pageSize,
    search: brandQuery.search,
  });

  const brands = brandsData?.brands?.data || [];
  const brandsCount = brandsData?.brands?.count || 0;

  /* =========================
     FORM
  ========================= */
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const selectedBrand = watch("brandName");

  /* =========================
     INIT
  ========================= */
  useEffect(() => {
    if (product && isOpen) {
      reset({
        name: product.name,
        brandName: product.brandName || "",
        categoryId: product.categoryId,
        description: product.description,
        removeMainImage: false,
        removeAllImages: false,
      });

      setPreview(product.imageUrl || null);
      setImageFile(null);
    }
  }, [product, isOpen, reset]);

  /* =========================
     IMAGE HANDLING
  ========================= */
  const handleFile = (file: File) => {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setPreview(product.imageUrl || null);
    if (fileRef.current) fileRef.current.value = "";
  };

  /* =========================
     SUBMIT
  ========================= */
  const onSubmit = async (data: FormValues) => {
    try {
      await updateProduct({
        id: product.id,
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        brandName: data.brandName,
        removeMainImage: data.removeMainImage,
        removeAllImages: data.removeAllImages,
        imageFiles: imageFile ? [imageFile] : undefined,
      }).unwrap();

      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Name
            </label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* BRAND (RADIX DROPDOWN + PAGINATION READY) */}
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between"
                >
                  {selectedBrand || "Select Brand"}
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px]"
              >
                <DropdownMenuItem
                  onSelect={() => setValue("brandName", "")}
                >
                  No Brand
                </DropdownMenuItem>

                {brandsLoading && (
                  <div className="p-2 text-sm text-muted-foreground">
                    Loading...
                  </div>
                )}

                {brands.map((b: any) => (
                  <DropdownMenuItem
                    key={b.id}
                    onSelect={() => setValue("brandName", b.name)}
                  >
                    {b.name}
                  </DropdownMenuItem>
                ))}

                {/* LOAD MORE */}
                {brands.length < brandsCount && (
                  <button
                    type="button"
                    className="w-full text-sm p-2 hover:bg-accent"
                    onClick={() =>
                      setBrandQuery((p) => ({
                        ...p,
                        pageIndex: p.pageIndex + 1,
                      }))
                    }
                  >
                    Load more...
                  </button>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between"
                >
                  {categories.find((c) => c.id === watch("categoryId"))?.name ||
                    "Select Category"}
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto">
                <DropdownMenuItem
                  onSelect={() => setValue("categoryId", "")}
                >
                  No Category
                </DropdownMenuItem>

                {categories.map((c) => (
                  <DropdownMenuItem
                    key={c.id}
                    onSelect={() => setValue("categoryId", c.id)}
                  >
                    {c.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {errors.categoryId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* CATEGORY */}
          {/* <div>
            <label className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              {...register("categoryId")}
              className="w-full border rounded-md p-2"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div> */}

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <Input {...register("description")} />
          </div>

          {/* IMAGE */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
          >
            {preview ? (
              <img
                src={preview}
                className="max-h-40 mx-auto object-contain"
              />
            ) : (
              <>
                <ImageIcon className="mx-auto mb-2" />
                <p>Drag & drop or click to upload</p>
              </>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            hidden
            onChange={(e) =>
              e.target.files?.[0] && handleFile(e.target.files[0])
            }
          />

          {imageFile && (
            <Button type="button" variant="outline" onClick={clearImage}>
              <X className="w-4 h-4 mr-2" />
              Remove Image
            </Button>
          )}

          {/* FLAGS */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("removeMainImage")} />
              Remove main image
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("removeAllImages")} />
              Remove all images
            </label>
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};