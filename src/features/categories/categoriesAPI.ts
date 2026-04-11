import { apiClient } from "@/app/api-client";
import {
  GetCategoriesParams,
  GetCategoriesFlatResponse,
  GetCategoriesTreeResponse,
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
  useGetCategoriesTreeQuery,
  useDeleteCategoryMutation,
} = categoriesApi;
