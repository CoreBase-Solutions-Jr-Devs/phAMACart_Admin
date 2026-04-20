import { useEffect, useState } from "react";
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

import { Brand } from "@/features/brands/brandsType";
import { useUpdateBrandMutation } from "@/features/brands/brandsAPI";

import MultiFileUploader, {
  UploadFileItem,
} from "@/components/upload/MultiFileUploader";
import { parseError } from "@/lib/parse-error";
import { toast } from "sonner";

/* =========================
   SCHEMA
========================= */
const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  brand: Brand;
  children: React.ReactNode;
}

export const UpdateBrandFormDialog = ({ brand, children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [updateBrand, { isLoading }] = useUpdateBrandMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const [files, setFiles] = useState<UploadFileItem[]>([]);

  /* =========================
     INIT
  ========================= */
  useEffect(() => {
    if (brand && isOpen) {
      reset({ name: brand.name });

      setFiles(
        brand.brandImageUrl
          ? [
            {
              id: "existing-image",
              file: null,
              preview: brand.brandImageUrl,
            },
          ]
          : []
      );
    }
  }, [brand, isOpen, reset]);

  /* =========================
     SUBMIT
  ========================= */
  const onSubmit = async (data: FormValues) => {
    try {
      const imageFile = files[0]?.file || undefined;

      await updateBrand({
        id: brand.id,
        name: data.name,
        imageFile,
      }).unwrap();

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
          <DialogTitle>Edit Brand</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Brand Name
            </label>
            <Input placeholder="Brand Name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* IMAGE UPLOADER */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Brand Image
            </label>

            <MultiFileUploader
              value={files}
              onChange={(f) => setFiles(f.slice(0, 1))} // enforce single file
              multiple={false}
            />
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