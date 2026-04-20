export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentCategoryId: string | null;
  parentCategoryName?: string | null;
  isActive: boolean;
  displayOrder: number;
  children?: Category[];
}

export interface GetCategoriesFlatResponse {
  categories: Category[];
}

export interface GetCategoryByIdResponse {
  category: Category;
}

export interface GetCategoriesTreeResponse {
  categories: Category[];
}

export interface GetCategoriesParams {
  search?: string;
  parentId?: string;
  isActive?: boolean;
}