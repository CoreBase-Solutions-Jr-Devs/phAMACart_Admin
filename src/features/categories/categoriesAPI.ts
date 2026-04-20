import { apiClient } from "@/app/api-client";
import {
  GetCategoriesParams,
  GetCategoriesFlatResponse,
  GetCategoriesTreeResponse,
  Category,
  GetCategoryByIdResponse,
} from "./categoriesType";

export const categoriesApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * FLAT categories
     */
    getCategoriesFlat: builder.query<
      GetCategoriesFlatResponse,
      GetCategoriesParams | void
    >({
      query: (params) => ({
        url: "/categories",
        method: "GET",
        params: params ?? {},
      }),
      providesTags: ["categories"],
    }),

    /**
     * LEAF categories — only categories with no children, assignable to products
     */
    getLeafCategories: builder.query<{ categories: Category[] }, void>({
      query: () => ({
        url: "/categories/leaf",
        method: "GET",
      }),
      providesTags: ["categories"],
    }),

    /**
     * TREE categories (hierarchical)
     */
    getCategoriesTree: builder.query<GetCategoriesTreeResponse, void>({
      query: () => ({
        url: "/categories/hierarchy",
        method: "GET",
      }),
      providesTags: ["categories"],
    }),

    getCategoryById: builder.query<GetCategoryByIdResponse, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "categories", id }],
    }),
    /**
     * CREATE category
     */
    createCategory: builder.mutation<
      Category,
      {
        name?: string;
        slug?: string;
        description?: string;
        parentCategoryId?: string;
        displayOrder?: number;
      }
    >({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["categories"],
    }),

    /**
     * UPDATE category
     */
    updateCategory: builder.mutation<
      Category,
      {
        id: string;
        name?: string;
        description?: string;
         parentCategoryId?: string | null;
      }
    >({
      query: ({ id, name, description, parentCategoryId }) => ({
        url: "/categories",
        method: "PUT",
        body: { category: { id, name, description, parentCategoryId } },
      }),
      invalidatesTags: ["categories"],
    }),

    /**
     * DELETE category
     */
    deleteCategory: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categories"],
    }),
  }),
});

export const {
  useGetCategoriesFlatQuery,
  useGetCategoryByIdQuery,
  useGetLeafCategoriesQuery,
  useGetCategoriesTreeQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;