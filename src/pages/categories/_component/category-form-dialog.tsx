import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Category } from "@/features/categories/categoriesType";
import {
  useGetCategoriesFlatQuery,
  useUpdateCategoryMutation,
} from "@/features/categories/categoriesAPI";

import { parseError } from "@/lib/parse-error";

/* =========================
   SCHEMA
========================= */

const schema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  parentCategoryId: z.string().nullable(),
});

type FormValues = z.infer<typeof schema>;

/* =========================
   PROPS
========================= */

interface Props {
  category: Category;
  children: React.ReactNode;
}

/* =========================
   COMPONENT
========================= */

export const CategoryFormDialog = ({
  category,
  children,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [updateCategory, { isLoading }] =
    useUpdateCategoryMutation();

  const {
    data: categoriesResponse,
    isLoading: categoriesLoading,
  } = useGetCategoriesFlatQuery();

  const categories: Category[] =
    categoriesResponse?.categories ?? [];

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      parentCategoryId: null,
    },
  });

  /* =========================
     INITIALIZE FORM
  ========================= */

  useEffect(() => {
    if (!category || !isOpen) {
      return;
    }

    reset({
      name: category.name,
      description: category.description ?? "",

      /*
       * Existing parent:
       *   "some-guid"
       *
       * Root category:
       *   null
       *
       * Never initialise this as "".
       */
      parentCategoryId:
        category.parentCategoryId || null,
    });
  }, [category, isOpen, reset]);

  /* =========================
     AVAILABLE PARENTS
  ========================= */

  /*
   * Do not allow the category itself to become
   * its own parent.
   */
  const availableParentCategories = categories.filter(
    (item: Category) => item.id !== category.id
  );

  /* =========================
     SUBMIT
  ========================= */

  const onSubmit = async (data: FormValues) => {
    try {
      /*
       * Explicitly normalize the root value.
       *
       * This guarantees:
       *
       * ""     -> null
       * null   -> null
       * GUID   -> GUID
       */
      const parentCategoryId =
        data.parentCategoryId || null;

      await updateCategory({
        id: category.id,
        name: data.name.trim(),
        description: data.description?.trim() ?? "",
        parentCategoryId,
      }).unwrap();

      toast.success("Category updated successfully.");

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
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* =========================
              NAME
          ========================= */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Category Name
            </label>

            <Input
              placeholder="Category Name"
              {...register("name")}
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* =========================
              DESCRIPTION
          ========================= */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>

            <Input
              placeholder="Description"
              {...register("description")}
            />

            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* =========================
              PARENT CATEGORY
          ========================= */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Parent Category
            </label>

            <Controller
              name="parentCategoryId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? "root"}
                  onValueChange={(value) => {
                    /*
                     * "root" is only a UI value.
                     *
                     * Internally we store null.
                     */
                    field.onChange(
                      value === "root" ? null : value
                    );
                  }}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>

                  <SelectContent>
                    {/* ROOT OPTION */}

                    <SelectItem value="root">
                      No Parent (Root Category)
                    </SelectItem>

                    {/* PARENT CATEGORIES */}

                    {availableParentCategories.map(
                      (parent: Category) => (
                        <SelectItem
                          key={parent.id}
                          value={parent.id}
                        >
                          {parent.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.parentCategoryId && (
              <p className="mt-1 text-sm text-red-500">
                {errors.parentCategoryId.message}
              </p>
            )}
          </div>

          {/* =========================
              SUBMIT
          ========================= */}

          <Button
            type="submit"
            disabled={
              !isValid ||
              isLoading ||
              categoriesLoading
            }
            className="w-full"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
