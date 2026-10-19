import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  useGetCategoriesTreeQuery,
  useCreateCategoryMutation,
} from "@/features/categories/categoriesAPI";

import { parseError } from "@/lib/parse-error";

/* =========================
   SCHEMA
========================= */

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(100, "Description cannot exceed 100 characters"),

  parentCategoryId: z.string().nullable(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  children: React.ReactNode;
}

export const NewCategoryFormDialog = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const {
    control,
    register,
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

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
  } = useGetCategoriesTreeQuery();

  const categories = categoriesData?.categories ?? [];

  /* =========================
     SUBMIT
  ========================= */

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        name: data.name.trim(),
        slug: data.name.trim().toLowerCase().split(" ").join("-"),
        description: data.description.trim(),

        // Root category MUST be null.
        parentCategoryId: data.parentCategoryId ?? null,
      };

      await createCategory(payload).unwrap();

      toast.success("Category created successfully.");

      reset({
        name: "",
        description: "",
        parentCategoryId: null,
      });

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
      onOpenChange={(open) => {
        setIsOpen(open);

        if (!open) {
          reset({
            name: "",
            description: "",
            parentCategoryId: null,
          });
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* =========================
              NAME
          ========================= */}

          <div>
            <label className="block text-sm font-medium mb-1">
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
            <label className="block text-sm font-medium mb-1">
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
            <label className="block text-sm font-medium mb-1">
              Parent Category
            </label>

            <Controller
              name="parentCategoryId"
              control={control}
              render={({ field }) => {
                const selectedCategory = categories.find(
                  (category) => category.id === field.value
                );

                return (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={categoriesLoading}
                        className="w-full justify-between"
                      >
                        <span className="truncate">
                          {selectedCategory?.name ??
                            "No Parent (Root Category)"}
                        </span>

                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="start"
                      className="w-[var(--radix-dropdown-menu-trigger-width)]"
                    >
                      <DropdownMenuRadioGroup
                        value={field.value ?? "root"}
                        onValueChange={(value) => {
                          // "root" is ONLY a UI value.
                          // The form/API value is null.
                          field.onChange(
                            value === "root" ? null : value
                          );
                        }}
                      >
                        {/* ROOT CATEGORY */}

                        <DropdownMenuRadioItem value="root">
                          No Parent (Root Category)
                        </DropdownMenuRadioItem>

                        {/* PARENT CATEGORIES */}

                        {categories.map((category) => (
                          <DropdownMenuRadioItem
                            key={category.id}
                            value={category.id}
                          >
                            {category.name}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }}
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
            {isLoading ? "Saving..." : "Create Category"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};