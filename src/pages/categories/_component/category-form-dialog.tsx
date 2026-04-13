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
import { Category } from "@/features/categories/categoriesType";
import { useUpdateCategoryMutation } from "@/features/categories/categoriesAPI";

/* =========================
   SCHEMA
========================= */
const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(100).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  category: Category;
  children: React.ReactNode;
}

export const CategoryFormDialog = ({ category, children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

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
    if (category && isOpen) {
      reset({
        name: category.name,
        description: category.description ?? "",
      });
    }
  }, [category, isOpen, reset]);

  /* =========================
     SUBMIT
  ========================= */
  const onSubmit = async (data: FormValues) => {
    try {
      await updateCategory({
        id: category.id,
        name: data.name,
        description: data.description,
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
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* NAME */}
          <div>
            <Input placeholder="Category Name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <Input placeholder="Description" {...register("description")} />
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
