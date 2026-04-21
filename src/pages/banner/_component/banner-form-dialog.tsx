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
  Title: z.string().min(1).max(100),

  SortOrder: z.coerce
    .number({ invalid_type_error: "SortOrder must be a number" })
    .min(0)
    .max(100),

  Type: z.coerce.number().refine((val) => !isNaN(val)),

  StartDate: z.string().min(1),
  EndDate: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

/* =========================
   HELPERS
========================= */
const toDateInputValue = (date?: Date | string) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

interface Props {
  banner?: Banner;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BannerFormDialog = ({ banner, open, onOpenChange }: Props) => {
  const [files, setFiles] = useState<UploadFileItem[]>([]);
  const [updateBanner, { isLoading }] = useUpdateBannerMutation();

  const { data: bannerData, isFetching } = useGetBannerByIdQuery(
    banner?.id ?? "",
    {
      skip: !open || !banner?.id,
    }
  );

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
  });

  const typeValue = watch("Type");

  /* =========================
     FILL FORM
  ========================= */
  const fillForm = (source: Banner) => {
    reset({
      Title: source.title ?? "",
      SortOrder: source.sortOrder ?? 0,
      Type: Number(source.type),
      StartDate: toDateInputValue(source.startDate),
      EndDate: toDateInputValue(source.endDate),
    });

    setFiles(
      source.imageUrl
        ? [{ id: "img", file: null, preview: source.imageUrl }]
        : []
    );
  };

  useEffect(() => {
    if (open && banner) fillForm(banner);
  }, [open, banner]);

  useEffect(() => {
    if (freshBanner) fillForm(freshBanner);
  }, [freshBanner]);

  /* =========================
     SUBMIT
  ========================= */
  const onSubmit = async (data: FormValues) => {
  try {
    const imageFile = files[0]?.file ?? undefined;

    console.log("SortOrder value:", data.SortOrder, typeof data.SortOrder);

    await updateBanner({
      id: banner?.id || "",
      title: data.Title,
      type: String(data.Type),
      sortOrder: Number(data.SortOrder),
      startDate: new Date(data.StartDate).toISOString(), 
      endDate: new Date(data.EndDate).toISOString(),
      imageFile: imageFile ? [imageFile] : null,
    }).unwrap();

    toast.success("Banner updated successfully.");
    setTimeout(() => onOpenChange(false), 0);
  } catch (err) {
    toast.error(parseError(err));
  }
};
  /* =========================
     UI
  ========================= */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Banner</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">
          {isFetching && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              Loading...
            </div>
          )}

          {/* TITLE */}
          <Input placeholder="Title" {...register("Title")} />
          {errors.Title && <p>{errors.Title.message}</p>}

          {/* SORT ORDER */}
          <Input type="number" {...register("SortOrder")} />
          {errors.SortOrder && <p>{errors.SortOrder.message}</p>}

          {/* TYPE */}
          <BannerTypeDropdown
            value={typeValue}
            onChange={(val) =>
              setValue("Type", val, { shouldValidate: true })
            }
          />

          {/* DATES */}
          <Input type="date" {...register("StartDate")} />
          <Input type="date" {...register("EndDate")} />

          {/* IMAGE */}
          <MultiFileUploader
            value={files}
            onChange={(f) => setFiles(f.slice(0, 1))}
          />

          {/* SUBMIT */}
          <Button type="submit" disabled={isLoading || isFetching}>
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};