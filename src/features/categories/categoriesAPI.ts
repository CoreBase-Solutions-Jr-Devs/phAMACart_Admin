import { apiClient } from "@/app/api-client";
import {
  GetCategoriesParams,
  GetCategoriesFlatResponse,
  GetCategoriesTreeResponse,
  Category,
} from "./categoriesType";

export const categoriesApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * FLAT categories (your new response)
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
     * Creat categories (your new response)
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
      query: (data) => {
        return {
          url: "/categories",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["categories"],
    }),
    /**
     * Update categories (your new response)
     */
    updateCategory: builder.mutation<
      Category,
      {
        id: string;
        name?: string;
        description?: string;
      }
    >({
      query: ({ id, name, description }) => {
        return {
          url: "/categories",
          method: "PUT",
          body: {
            category: {
              id,
              name,
              description,
            },
          },
        };
      },
      invalidatesTags: ["categories"],
    }),

    /**
     * TREE categories (hierarchical version)
     */
    getCategoriesTree: builder.query<GetCategoriesTreeResponse, void>({
      query: () => ({
        url: "/categories/hierarchy",
        method: "GET",
      }),
      providesTags: ["categories"],
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
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useGetCategoriesTreeQuery,
  useDeleteCategoryMutation,
} = categoriesApi;
