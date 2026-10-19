import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Product, UpdateProductPayload } from "@/features/products/productsType";
import { useUpdateProductMutation } from "@/features/products/productsAPI";
import { useGetBrandsQuery } from "@/features/brands/brandsAPI";
import { useGetLeafCategoriesQuery } from "@/features/categories/categoriesAPI";

import MultiFileUploader, {
  UploadFileItem,
} from "@/components/upload/MultiFileUploader";
import { parseError } from "@/lib/parse-error";

/* ========================= SCHEMA ========================= */
const schema = z.object({
  name: z.string().max(100).optional(),
  brandId: z.string().uuid().nullable().optional(),
  categoryId: z.string().uuid("Please select a category"),
  description: z.string().max(1000).optional(),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, "Price cannot be negative")
    .optional(),
  isDealOfTheDay: z.boolean(),
  isBestSeller: z.boolean(),
  isNewArrival: z.boolean(),
  removeMainImage: z.boolean(),
  removeGalleryImages: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductFormDialog = ({ product, open, onOpenChange }: Props) => {
  const [mainImageFiles, setMainImageFiles] = useState<UploadFileItem[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<UploadFileItem[]>([]);

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
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      brandId: null,
      categoryId: "",
      description: "",
      price: undefined,
      isDealOfTheDay: false,
      isBestSeller: false,
      isNewArrival: false,
      removeMainImage: false,
      removeGalleryImages: false,
    },
  });

  const watchedValues = watch();

  /* ========================= INIT ========================= */
  useEffect(() => {
    if (!open || !product) return;

    reset({
      name: product.name,
      brandId: product.brandId ?? null,
      categoryId: product.categoryId,
      description: product.description,
      price: product.price,
      isDealOfTheDay: product.isDealOfTheDay ?? false,
      isBestSeller: product.isBestSeller ?? false,
      isNewArrival: product.isNewArrival ?? false,
      removeMainImage: false,
      removeGalleryImages: false,
    });

    setMainImageFiles(
      product.imageUrl
        ? [{ id: "existing-main", file: null, preview: product.imageUrl }]
        : []
    );

    setGalleryFiles(
      (product.galleryImageUrls ?? []).map((url, i) => ({
        id: `existing-gallery-${i}`,
        file: null,
        preview: url,
      }))
    );
  }, [open, product, reset]);

  const newMainImage = mainImageFiles.find((f) => !!f.file)?.file ?? null;
  const newGalleryImages = useMemo(
    () => galleryFiles.filter((f) => !!f.file).map((f) => f.file!) ?? [],
    [galleryFiles]
  );

  const selectedBrandName = useMemo(() => {
    const id = watchedValues.brandId;
    if (!id) return "No Brand Selected";
    return brands.find((b: any) => b.id === id)?.name ?? "Unknown brand";
  }, [watchedValues.brandId, brands]);

  /* ========================= DIRTY-CHECK ========================= */
  const isDirty =
    !!product &&
    (watchedValues.name !== product.name ||
      watchedValues.description !== product.description ||
      (watchedValues.brandId ?? null) !== (product.brandId ?? null) ||
      watchedValues.categoryId !== product.categoryId ||
      watchedValues.price !== product.price ||
      watchedValues.isDealOfTheDay !== (product.isDealOfTheDay ?? false) ||
      watchedValues.isBestSeller !== (product.isBestSeller ?? false) ||
      watchedValues.isNewArrival !== (product.isNewArrival ?? false) ||
      !!newMainImage ||
      newGalleryImages.length > 0 ||
      watchedValues.removeMainImage ||
      watchedValues.removeGalleryImages);

  /* ========================= SUBMIT ========================= */
  const onSubmit = async (data: FormValues) => {
    if (!product) return;

    try {
      const payload: UpdateProductPayload = {
        id: product.id,
        categoryId: data.categoryId,
      };

      // Only send fields that actually changed
      if (data.name !== product.name) payload.name = data.name;
      if (data.description !== product.description)
        payload.description = data.description;

      // Brand handling — three exclusive states:
      //   1. removed
      //   2. changed to a new brand
      //   3. unchanged (don't send)
      const currentBrandId = product.brandId ?? null;
      const nextBrandId = data.brandId ?? null;

      if (nextBrandId === null && currentBrandId !== null) {
        payload.removeBrand = true;
      } else if (nextBrandId !== null && nextBrandId !== currentBrandId) {
        payload.brandId = nextBrandId;
      }

      // Price
      if (data.price !== undefined && data.price !== product.price) {
        payload.price = data.price;
      }

      // Deal of the day
      if (data.isDealOfTheDay !== (product.isDealOfTheDay ?? false)) {
        payload.isDealOfTheDay = data.isDealOfTheDay;
      }

      // Best Seller
      if (data.isBestSeller !== (product.isBestSeller ?? false)) {
        payload.isBestSeller = data.isBestSeller;
      }

      // New Arrival
      if (data.isNewArrival !== (product.isNewArrival ?? false)) {
        payload.isNewArrival = data.isNewArrival;
      }

      // Images — backend requires you not to upload + remove in the same call
      if (newMainImage) {
        payload.mainImageFile = newMainImage;
      } else if (data.removeMainImage) {
        payload.removeMainImage = true;
      }

      if (newGalleryImages.length > 0) {
        payload.galleryImageFiles = newGalleryImages;
      } else if (data.removeGalleryImages) {
        payload.removeGalleryImages = true;
      }

      await updateProduct(payload).unwrap();

      toast.success("Product updated successfully");
      onOpenChange(false);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  /* ========================= RENDER ========================= */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-2">
          {/* NAME */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Product Name</label>
            <Input {...register("name")} placeholder="Enter product name" />
          </div>

          {/* BRAND */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Brand</label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between"
                >
                  {selectedBrandName}
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-full max-h-[300px] overflow-y-auto">
                <DropdownMenuItem
                  onSelect={() =>
                    setValue("brandId", null, { shouldDirty: true })
                  }
                >
                  No Brand
                </DropdownMenuItem>

                {brands.map((b: any) => (
                  <DropdownMenuItem
                    key={b.id}
                    onSelect={() =>
                      setValue("brandId", b.id, { shouldDirty: true })
                    }
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
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between"
                >
                  {leafCategories.find((c) => c.id === watch("categoryId"))
                    ?.name ?? "Select category"}
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
                {leafCategories.map((c) => (
                  <DropdownMenuItem
                    key={c.id}
                    onSelect={() =>
                      setValue("categoryId", c.id, { shouldDirty: true })
                    }
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
            <label className="text-sm font-medium">Product Description</label>
            <Input
              {...register("description")}
              placeholder="Enter product description"
            />
          </div>

          {/* DEAL OF THE DAY */}
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">Deal of the Day</p>
              <p className="text-xs text-muted-foreground">
                Feature this product on the deals carousel.
              </p>
            </div>

            <Controller
              name="isDealOfTheDay"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {/* BEST SELLER */}
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">Best Seller</p>
              <p className="text-xs text-muted-foreground">
                Feature this product as a best seller.
              </p>
            </div>

            <Controller
              name="isBestSeller"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {/* NEW ARRIVAL */}
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">New Arrival</p>
              <p className="text-xs text-muted-foreground">
                Feature this product as a new arrival.
              </p>
            </div>

            <Controller
              name="isNewArrival"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {/* MAIN IMAGE */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Main Image</label>
            <MultiFileUploader
              value={mainImageFiles}
              onChange={(f) => {
                setMainImageFiles(f.slice(0, 1));
                if (f.some((x) => !!x.file)) {
                  setValue("removeMainImage", false);
                }
              }}
              multiple={false}
            />

            {product?.imageUrl && !newMainImage && (
              <label className="flex items-center gap-2 text-sm cursor-pointer pt-2">
                <input type="checkbox" {...register("removeMainImage")} />
                Remove main image
              </label>
            )}
          </div>

          {/* GALLERY IMAGES */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Gallery Images{" "}
              <span className="text-xs text-muted-foreground">
                (up to 10)
              </span>
            </label>
            <MultiFileUploader
              value={galleryFiles}
              onChange={(f) => {
                setGalleryFiles(f.slice(0, 10));
                if (f.some((x) => !!x.file)) {
                  setValue("removeGalleryImages", false);
                }
              }}
              multiple
            />

            {(product?.galleryImageUrls?.length ?? 0) > 0 &&
              newGalleryImages.length === 0 && (
                <label className="flex items-center gap-2 text-sm cursor-pointer pt-2">
                  <input type="checkbox" {...register("removeGalleryImages")} />
                  Remove all gallery images
                </label>
              )}
          </div>

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