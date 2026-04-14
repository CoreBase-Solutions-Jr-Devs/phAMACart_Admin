import { useState } from "react";
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
import {
  useGetCategoriesTreeQuery,
  useCreateCategoryMutation,
} from "@/features/categories/categoriesAPI";

/* =========================
   SCHEMA
========================= */
const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  description: z.string().trim().min(1, "description is required").max(100),
  parentCategoryId: z.string().optional().nullable(),
  // displayOrder: z.string().min(0, "Display order must be at least 0").max(100),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  children: React.ReactNode;
}

export const NewCategoryFormDialog = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { data: categoriesData } = useGetCategoriesTreeQuery();

  const categories = categoriesData?.categories || [];

  /* =========================
     SUBMIT
  ========================= */
  const onSubmit = async (data: FormValues) => {
    try {
      const payload: any = {
        name: data.name,
        slug: data.name.toLowerCase().split(" ").join("-"),
        description: data.description,
        // displayOrder: Number(data.displayOrder),
      };

      if (data.parentCategoryId) {
        payload.parentCategoryId = data.parentCategoryId;
      }

      await createCategory(payload).unwrap();

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
          <DialogTitle>Create Category</DialogTitle>
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
          {/* CATEGORY */}
          <div>
            <select
              {...register("parentCategoryId")}
              className="w-full border rounded-md p-2"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          {/* displayOrder */}
          {/* <div>
            <Input
              type="number"
              min={0}
              placeholder="displayOrder"
              {...register("displayOrder")}
            />
            {errors.displayOrder && (
              <p className="text-sm text-red-500">
                {errors.displayOrder.message}
              </p>
            )}
          </div> */}

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
