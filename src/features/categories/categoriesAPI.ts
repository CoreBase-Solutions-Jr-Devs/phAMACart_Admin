import { apiClient } from "@/app/api-client";
import { ADMIN, CLIENT } from "@/app/api-paths";
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
        url: `${CLIENT}/categories`,
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
        url: `${CLIENT}/categories/leaf`,
        method: "GET",
      }),
      providesTags: ["categories"],
    }),

    /**
     * TREE categories (hierarchical)
     */
    getCategoriesTree: builder.query<GetCategoriesTreeResponse, void>({
      query: () => ({
        url: `${CLIENT}/categories/hierarchy`,
        method: "GET",
      }),
      providesTags: ["categories"],
    }),

    getCategoryById: builder.query<GetCategoryByIdResponse, string>({
      query: (id) => ({
        url: `${ADMIN}/categories/${id}`,
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
        parentCategoryId?: string | null;
        displayOrder?: number;
      }
    >({
      query: (data) => ({
        url: `${ADMIN}/categories`,
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
        url: `${ADMIN}/categories`,
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
        url: `${ADMIN}/categories/${id}`,
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