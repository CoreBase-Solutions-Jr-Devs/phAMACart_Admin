import { useRef, useState } from "react";
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
import { useCreateBannerMutation } from "@/features/banner/bannerAPI";
import { useGetCompanyProfileQuery } from "@/features/companyProfile/companyProfile";


const schema = z.object({
  Title: z.string().min(1, "Name is required").max(100),
  SortOrder: z.coerce.number().min(0).max(100),
  Type: z.coerce.number().min(0).max(100),
  StartDate: z.coerce.date(),
  EndDate: z.coerce.date(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  children: React.ReactNode;
}

export const NewBannerFormDialog = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [createBanner, { isLoading }] = useCreateBannerMutation();

  const { data: companyProfile, isLoading: isProfileLoading } =
    useGetCompanyProfileQuery();

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

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
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = async (data: FormValues) => {
    try {
      if (!companyProfile?.id) return;

      await createBanner({
        Title: data.Title,
        SortOrder: data.SortOrder,
        Type: data.Type,
        StartDate: data.StartDate,
        EndDate: data.EndDate,
        ImageFile: imageFile ? [imageFile] : undefined,
        companyProfileId: companyProfile.id,
      }).unwrap();

      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Banner</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* TITLE */}
          <Input placeholder="Title" {...register("Title")} />

          {/* SORT ORDER */}
          <Input type="number" placeholder="SortOrder" {...register("SortOrder")} />

          {/* TYPE */}
          <select {...register("Type")} className="w-full border rounded-md p-2">
            <option value="">Select Type</option>
            <option value="0">Occasional</option>
            <option value="1">Promotional</option>
            <option value="2">Fixed</option>
          </select>

          {/* DATES */}
          <Input type="date" {...register("StartDate")} />
          <Input type="date" {...register("EndDate")} />

          {/* IMAGE UPLOAD */}
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
            disabled={!isValid || isLoading || isProfileLoading}
            className="w-full"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};