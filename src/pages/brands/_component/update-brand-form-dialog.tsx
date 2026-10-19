import { useEffect, useMemo, useState } from "react";
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

import { Brand } from "@/features/brands/brandsType";
import { useUpdateBrandMutation } from "@/features/brands/brandsAPI";

import MultiFileUploader, {
  UploadFileItem,
} from "@/components/upload/MultiFileUploader";

import { parseError } from "@/lib/parse-error";

/* =========================
   CONSTANTS / SCHEMA
========================= */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
];

const ALLOWED_EXT = [
  ".jpg",
  ".jpeg",
  ".png",
];

const schema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100),

  description: z
    .string()
    .min(1, "Description is required"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  brand: Brand;
  children: React.ReactNode;
}

export const UpdateBrandFormDialog = ({
  brand,
  children,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [files, setFiles] = useState<
    UploadFileItem[]
  >([]);

  const [imageError, setImageError] =
    useState<string | null>(null);

  const [updateBrand, { isLoading }] =
    useUpdateBrandMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: {
      errors,
      isValid,
    },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),

    mode: "onChange",

    defaultValues: {
      name: brand.name,
      description: brand.description ?? "",
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

      setImageError(null);

      setFiles(
        brand.brandImageUrl
          ? [
              {
                id: "existing-image",
                file: null,
                preview: brand.brandImageUrl,
              },
            ]
          : [],
      );
    }
  }, [brand, isOpen, reset]);

  /* =========================
     IMAGE VALIDATION
  ========================= */
  const newImageFile =
    files.find((x) => !!x.file)?.file ?? null;

  const validateImage = (
    file: File,
  ): string | null => {
    const ext = `.${file.name
      .split(".")
      .pop()
      ?.toLowerCase()}`;

    const isValidMime =
      ALLOWED_MIME.includes(file.type);

    const isValidExt =
      ALLOWED_EXT.includes(ext);

    if (!isValidMime && !isValidExt) {
      return "Only JPG, JPEG, or PNG images are allowed.";
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return "Image must be 5MB or smaller.";
    }

    if (file.size === 0) {
      return "Image file is empty.";
    }

    return null;
  };

  useEffect(() => {
    if (!newImageFile) {
      setImageError(null);
      return;
    }

    setImageError(
      validateImage(newImageFile),
    );
  }, [newImageFile]);

  /* =========================
     DIRTY CHECK
  ========================= */
  const watchedName = watch("name");

  const watchedDescription =
    watch("description");

  const isDirty = useMemo(() => {
    return (
      watchedName !== brand.name ||
      watchedDescription !==
        (brand.description ?? "") ||
      !!newImageFile
    );
  }, [
    watchedName,
    watchedDescription,
    brand.name,
    brand.description,
    newImageFile,
  ]);

  /* =========================
     SUBMIT
  ========================= */
  const onSubmit = async (
    data: FormValues,
  ) => {
    if (newImageFile) {
      const error =
        validateImage(newImageFile);

      if (error) {
        setImageError(error);
        return;
      }
    }

    try {
      await updateBrand({
        id: brand.id,

        name: data.name,

        description: data.description,

        /**
         * Preserve current image when
         * no new image is uploaded.
         */
        brandImageUrl:
          brand.brandImageUrl ?? null,

        /**
         * Optional replacement image
         */
        brandImageFile: newImageFile,
      }).unwrap();

      toast.success(
        "Brand updated successfully.",
      );

      setIsOpen(false);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Edit Brand
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* NAME */}
          <div className="space-y-1">
            <label className="block text-sm font-medium">
              Brand Name{" "}
              <span className="text-red-500">
                *
              </span>
            </label>

            <Input
              placeholder="Brand name"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-1">
            <label className="block text-sm font-medium">
              Description{" "}
              <span className="text-red-500">
                *
              </span>
            </label>

            <Textarea
              rows={4}
              placeholder="Brand description"
              {...register("description")}
            />

            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* IMAGE */}
          <div className="space-y-1">
            <label className="block text-sm font-medium">
              Brand Image
            </label>

            <MultiFileUploader
              value={files}
              onChange={(f) =>
                setFiles(f.slice(0, 1))
              }
              multiple={false}
            />

            <p className="text-xs text-muted-foreground">
              JPG, JPEG, PNG · up to 5MB
            </p>

            {imageError && (
              <p className="text-sm text-red-500">
                {imageError}
              </p>
            )}
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            disabled={
              !isValid ||
              !isDirty ||
              !!imageError ||
              isLoading
            }
            className="w-full"
          >
            {isLoading
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};