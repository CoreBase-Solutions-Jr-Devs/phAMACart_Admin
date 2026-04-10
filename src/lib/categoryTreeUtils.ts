import { Category } from "@/features/categories/categoriesType";

export type CategoryTreeItem = Category & {
  level: number;
  isLeaf: boolean;
};

export const flattenCategoryTree = (
  categories: Category[],
  level = 0
): CategoryTreeItem[] => {
  let result: CategoryTreeItem[] = [];

  const sorted = [...categories].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  for (const cat of sorted) {
    const hasChildren = !!cat.children?.length;

    result.push({
      ...cat,
      level,
      isLeaf: !hasChildren,
    });

    if (hasChildren) {
      result = result.concat(
        flattenCategoryTree(cat.children!, level + 1)
      );
    }
  }

  return result;
};