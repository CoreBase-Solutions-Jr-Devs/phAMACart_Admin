import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, ImageIcon } from "lucide-react";
import { Brand } from "@/features/brands/brandsType";
import { useCreateBrandMutation } from "@/features/brands/brandsAPI";
import { parseError } from "@/lib/parse-error";

/* =========================
   SCHEMA
========================= */
const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(1, "Description is required"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  brand?: Brand;
  children: React.ReactNode;
}

export const BrandFormDialog = ({ brand, children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const [createBrand, { isLoading }] = useCreateBrandMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  /* =========================
     INIT
  ========================= */
  useEffect(() => {
    if (brand && isOpen) {
      reset({
        name: brand.name,
        description: brand.description ?? "",
      });

      setPreview(brand.brandImageUrl || null);
      setImageFile(null);
    }
  }, [brand, isOpen, reset]);

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

    if (file) {
      handleFile(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setPreview(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  /* =========================
     SUBMIT
  ========================= */
  const onSubmit = async (data: FormValues) => {
    try {
      if (!imageFile) {
        toast.error("Please upload a brand image.");
        return;
      }

      await createBrand({
        name: data.name,
        description: data.description,
        brandImageFile: imageFile,
      }).unwrap();

      toast.success("Brand created successfully.");

      reset();
      setImageFile(null);
      setPreview(null);
      setIsOpen(false);
    } catch (err) {
      toast.error(parseError(err));
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
          <DialogTitle>Create Brand</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* NAME */}
          <div>
            <Input placeholder="Brand name" {...register("name")} />
          </div>

          {/* DESCRIPTION */}
          <div>
            <Textarea
              placeholder="Brand description"
              rows={4}
              {...register("description")}
            />
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
                alt="Preview"
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
            accept=".jpg,.jpeg,.png"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                handleFile(file);
              }
            }}
          />

          {imageFile && (
            <Button
              type="button"
              variant="outline"
              onClick={clearImage}
            >
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
            {isLoading ? "Creating..." : "Create Brand"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};