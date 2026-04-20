import { useEffect, useState } from "react";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { Banner } from "@/features/banner/bannerType";
import {
  useGetBannerByIdQuery,
  useUpdateBannerMutation,
} from "@/features/banner/bannerAPI";

import MultiFileUploader, {
  UploadFileItem,
} from "@/components/upload/MultiFileUploader";

import { parseError } from "@/lib/parse-error";
import { BannerTypeDropdown } from "./banner-type-dropdown";

/* =========================
   SCHEMA
========================= */
const schema = z.object({
  Title: z.string().min(1, "Title is required").max(100),

  SortOrder: z.coerce
    .number({ invalid_type_error: "SortOrder must be a number" })
    .min(0)
    .max(100),

  Type: z.coerce
    .number({ invalid_type_error: "Type is required" })
    .refine((val) => !isNaN(val), { message: "Type is required" }),

  StartDate: z.string().min(1, "Start date is required"),
  EndDate: z.string().min(1, "End date is required"),
});

type FormValues = z.infer<typeof schema>;

/* =========================
   HELPERS
========================= */
const toDateInputValue = (date?: Date | string) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

interface Props {
  banner?: Banner;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BannerFormDialog = ({ banner, open, onOpenChange }: Props) => {
  const [files, setFiles] = useState<UploadFileItem[]>([]);

  const [updateBanner, { isLoading }] = useUpdateBannerMutation();

  /* =========================
     FETCH FRESH DATA
  ========================= */
  const { data: bannerData, isFetching: isFetchingBanner } =
    useGetBannerByIdQuery(banner?.id ?? "", {
      skip: !open || !banner?.id,
    });

  const freshBanner = bannerData?.banner;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const typeValue = watch("Type");

  /* =========================
     FILL HELPERS
  ========================= */
  const fillForm = (source: Banner) => {
    reset({
      Title: source.title,
      SortOrder: source.sortOrder,
      Type: Number(source.type),
      StartDate: toDateInputValue(source.startDate),
      EndDate: toDateInputValue(source.endDate),
    });

    setFiles(
      source.imageUrl
        ? [{ id: "existing-banner-image", file: null, preview: source.imageUrl }]
        : []
    );
  };

  // Pre-fill immediately from prop when dialog opens
  useEffect(() => {
    if (!open || !banner) return;
    fillForm(banner);
  }, [open, banner]);

  // Overwrite with fresh API data when it arrives
  useEffect(() => {
    if (!freshBanner) return;
    fillForm(freshBanner);
  }, [freshBanner]);

  /* =========================
     SUBMIT
  ========================= */
  const onSubmit = async (data: FormValues) => {
    try {
      const imageFile = files[0]?.file ?? undefined;

      await updateBanner({
        id: banner?.id || "",
        title: data.Title,
        type: String(data.Type),
        imageFile: imageFile ? [imageFile] : null,
      }).unwrap();

      toast.success("Banner updated successfully.");
      onOpenChange(false);
    } catch (err) {
      toast.error(parseError(err));
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Edit Banner</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">
          {isFetchingBanner && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/60 backdrop-blur-sm">
              <span className="text-sm text-muted-foreground">Refreshing...</span>
            </div>
          )}

          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input placeholder="Title" {...register("Title")} />
            {errors.Title && (
              <p className="text-red-500 text-sm mt-1">{errors.Title.message}</p>
            )}
          </div>

          {/* SORT ORDER */}
          <div>
            <label className="block text-sm font-medium mb-1">Sort Order</label>
            <Input
              type="number"
              placeholder="Sort Order"
              {...register("SortOrder")}
            />
            {errors.SortOrder && (
              <p className="text-red-500 text-sm mt-1">{errors.SortOrder.message}</p>
            )}
          </div>

          {/* TYPE */}
          <label className="block text-sm font-medium mb-1">Baner Type</label>
          <BannerTypeDropdown
            value={typeValue}
            onChange={(val) => setValue("Type", val, { shouldValidate: true })}
            error={errors.Type?.message}
          />

          {/* START DATE */}
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <Input type="date" {...register("StartDate")} />
            {errors.StartDate && (
              <p className="text-red-500 text-sm mt-1">{errors.StartDate.message}</p>
            )}
          </div>

          {/* END DATE */}
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <Input type="date" {...register("EndDate")} />
            {errors.EndDate && (
              <p className="text-red-500 text-sm mt-1">{errors.EndDate.message}</p>
            )}
          </div>

          {/* IMAGE */}
          <div>
            <label className="block text-sm font-medium mb-2">Banner Image</label>
            <MultiFileUploader
              value={files}
              onChange={(f) => setFiles(f.slice(0, 1))}
              multiple={false}
            />
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            disabled={isLoading || isFetchingBanner}
            className="w-full"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};