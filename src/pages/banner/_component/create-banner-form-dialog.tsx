import { useState } from "react";
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

import { useCreateBannerMutation } from "@/features/banner/bannerAPI";
import { useGetCompanyProfileQuery } from "@/features/companyProfile/companyProfileAPI";

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

interface Props {
  children: React.ReactNode;
}

export const NewBannerFormDialog = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [createBanner, { isLoading }] = useCreateBannerMutation();

  const { data: companyProfile, isLoading: isProfileLoading } =
    useGetCompanyProfileQuery();

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
     FILE STATE
  ========================= */
  const [files, setFiles] = useState<UploadFileItem[]>([]);

  /* =========================
     SUBMIT
  ========================= */
  const onSubmit = async (data: FormValues) => {
    if (!companyProfile?.id) {
      toast.error("Company profile not loaded. Please try again.");
      return;
    }

    try {
      const imageFile = files[0]?.file ?? null;

      await createBanner({
        Title: data.Title,
        SortOrder: Number(data.SortOrder),
        Type: Number(data.Type),
        StartDate: new Date(data.StartDate),
        EndDate: new Date(data.EndDate),
        ImageFile: imageFile ? [imageFile] : undefined,
        companyProfileId: companyProfile.id,
      }).unwrap();

      toast.success("Banner created successfully");
      reset();
      setFiles([]);
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

      <DialogContent className="max-w-2xl" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>New Banner</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* TITLE */}
          <div>
            <Input placeholder="Title" {...register("Title")} />
            {errors.Title && (
              <p className="text-red-500 text-sm mt-1">{errors.Title.message}</p>
            )}
          </div>

          {/* SORT ORDER */}
          <div>
            <Input
              type="number"
              placeholder="Sort Order"
              {...register("SortOrder")}
            />
            {errors.SortOrder && (
              <p className="text-red-500 text-sm mt-1">{errors.SortOrder.message}</p>
            )}
          </div>

          {/* TYPE — dropdown */}
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
            disabled={isLoading || isProfileLoading}
            className="w-full"
          >
            {isLoading ? "Saving..." : "Save Banner"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};