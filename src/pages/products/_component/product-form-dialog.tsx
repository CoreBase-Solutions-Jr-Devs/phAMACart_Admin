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
import { X, ImageIcon } from "lucide-react";
import {
  Product,
  useUpdateProductMutation,
} from "@/features/products/productsAPI";

/* =========================
   SCHEMA
========================= */
const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  brandName: z.string().max(100).optional(),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  product: Product;
  categories: { id: string; name: string }[]; // 👈 pass from parent
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  /* =========================
     INIT
  ========================= */
  useEffect(() => {
    if (product && isOpen) {
      reset({
        name: product.name,
        brandName: product.brandName || product.externalName || "",
        categoryId: product.categoryId,
        description: product.description,
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
            <Input placeholder="Product Name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* BRAND */}
          <div>
            <Input placeholder="Brand" {...register("brandName")} />
          </div>

          {/* CATEGORY */}
          <div>
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
            {errors.categoryId && (
              <p className="text-sm text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <Input placeholder="Description" {...register("description")} />
          </div>

          {/* IMAGE */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
            onClick={() => fileRef.current?.click()}
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