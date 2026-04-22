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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Stores } from "@/features/stores/storesType";
import { parseError } from "@/lib/parse-error";
import { useUpdateStoreMutation } from "@/features/stores/storesAPI";

/* =========================
   SCHEMA
========================= */
const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  phone: z.string().max(100).optional(),
  workingHours: z.string().max(100).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  store: Stores;
  children: React.ReactNode;
}

export const StoreFormDialog = ({ store, children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [updateStore, { isLoading }] = useUpdateStoreMutation();

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
    if (store && isOpen) {
      reset({
        name: store.name,
        latitude: store.latitude ?? "",
        longitude: store.longitude ?? "",
        phone: store.phone ?? "",
        workingHours: store.workingHours ?? "",
      });
    }
  }, [store, isOpen, reset]);

  /* =========================
     SUBMIT
  ========================= */
  const onSubmit = async (data: FormValues) => {
    try {
      await updateStore({
        id: store.id,
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
        phone: data.phone,
        workingHours: data.workingHours,
      }).unwrap();

      toast.success("store updated successfully.");
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
          <DialogTitle>Edit Store</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium mb-1">Store Name</label>
            <Input placeholder="store Name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input placeholder="254***" {...register("phone")} />
          </div>

          {/* LATITUDE */}
          <div>
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <Input
              type="number"
              step={"any"}
              placeholder="-1.***"
              {...register("latitude")}
            />
          </div>

          {/* LATITUDE */}
          <div>
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <Input
              type="number"
              step={"any"}
              placeholder="-1.***"
              {...register("longitude")}
            />
          </div>

          {/* WORKING HOURS */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Working Hours
            </label>
            <Input {...register("workingHours")} />
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
