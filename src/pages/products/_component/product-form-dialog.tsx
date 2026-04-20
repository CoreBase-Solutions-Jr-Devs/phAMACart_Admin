import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Product, useUpdateProductMutation } from "@/features/products/productsAPI";
import { useGetBrandsQuery } from "@/features/brands/brandsAPI";
import { useGetLeafCategoriesQuery } from "@/features/categories/categoriesAPI";

import MultiFileUploader, { UploadFileItem } from "@/components/upload/MultiFileUploader";
import { parseError } from "@/lib/parse-error";

/* ========================= SCHEMA ========================= */
const schema = z.object({
  name: z.string().max(100).optional(),
  brandName: z.string().max(100).optional(),
  categoryId: z.string().uuid("Please select a category"),
  description: z.string().max(1000).optional(),
  removeMainImage: z.boolean(),
  removeAllImages: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductFormDialog = ({ product, open, onOpenChange }: Props) => {
  const [files, setFiles] = useState<UploadFileItem[]>([]);
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const { data: brandsData } = useGetBrandsQuery({
    pageIndex: 0,
    pageSize: 50,
    search: "",
  });

  const brands = brandsData?.brands?.data ?? [];

  const { data: leafData } = useGetLeafCategoriesQuery();
  const leafCategories = leafData?.categories ?? [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      brandName: "",
      categoryId: "",
      description: "",
      removeMainImage: false,
      removeAllImages: false,
    },
  });

  const watchedValues = watch();

  /* ========================= INIT ========================= */
  useEffect(() => {
    if (!open || !product) return;

    reset({
      name: product.name,
      brandName: product.brandName ?? "",
      categoryId: product.categoryId,
      description: product.description,
      removeMainImage: false,
      removeAllImages: false,
    });

    setFiles(
      product.imageUrl
        ? [{ id: "existing", file: null, preview: product.imageUrl }]
        : []
    );
  }, [open, product, reset]);

  const imageFile = files[0]?.file ?? null;

  const isDirty =
    product &&
    (
      watchedValues.name !== product.name ||
      watchedValues.description !== product.description ||
      watchedValues.brandName !== (product.brandName ?? "") ||
      watchedValues.categoryId !== product.categoryId ||
      !!imageFile ||
      watchedValues.removeMainImage ||
      watchedValues.removeAllImages
    );

  /* ========================= SUBMIT ========================= */
  const onSubmit = async (data: FormValues) => {
    if (!product) return;

    try {
      const payload: any = {
        id: product.id,
        categoryId: data.categoryId,
        removeMainImage: data.removeMainImage,
        removeAllImages: data.removeAllImages,
      };

      if (data.name !== product.name) payload.name = data.name;
      if (data.description !== product.description) payload.description = data.description;
      if (data.brandName !== (product.brandName ?? "")) {
        payload.brandName = data.brandName || null;
      }

      if (imageFile) payload.imageFiles = [imageFile];

      await updateProduct(payload).unwrap();

      toast.success("Product updated successfully");
      onOpenChange(false);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-2">

          {/* NAME */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Product Name
            </label>
            <Input
              {...register("name")}
              placeholder="Enter product name"
            />
          </div>

          {/* BRAND */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Brand
            </label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" className="w-full justify-between">
                  {watch("brandName") || "No Brand Selected"}
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-full max-h-[300px] overflow-y-auto">
                <DropdownMenuItem onSelect={() => setValue("brandName", "")}>
                  No Brand
                </DropdownMenuItem>

                {brands.map((b: any) => (
                  <DropdownMenuItem
                    key={b.id}
                    onSelect={() => setValue("brandName", b.name)}
                  >
                    {b.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* CATEGORY */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Category <span className="text-red-500">*</span>
            </label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" className="w-full justify-between">
                  {leafCategories.find(c => c.id === watch("categoryId"))?.name ??
                    "Select category"}
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
                {leafCategories.map((c) => (
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
              <p className="text-sm text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Product Description
            </label>

            <Input
              {...register("description")}
              placeholder="Enter product description"
            />
          </div>

          {/* IMAGE */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Product Image
            </label>

            <MultiFileUploader
              value={files}
              onChange={(f) => setFiles(f.slice(0, 1))}
              multiple={false}
            />
          </div>

          {/* REMOVE OPTIONS */}
          {/* <div className="space-y-2">
            <label className="text-sm font-medium">
              Image Actions
            </label>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" {...register("removeMainImage")} />
                Remove main image
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" {...register("removeAllImages")} />
                Remove all images
              </label>
            </div>
          </div> */}

          {/* SUBMIT */}
          <Button
            type="submit"
            disabled={!isDirty || isLoading}
            className="w-full"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>

        </form>
      </DialogContent>
    </Dialog>
  );
};