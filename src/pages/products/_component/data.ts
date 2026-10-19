import type { PageGuideContent } from "@/components/page-guide";

/* =========================================================
   PAGE GUIDE CONTENT (mock for now)
   Products, categories, and brands still come from the
   backend via productsAPI / categoriesAPI / brandsAPI —
   this file only holds the guide copy for the sidebar.
========================================================= */
export const productsPageGuide: PageGuideContent = {
  eyebrow: "PRODUCTS GUIDE",
  title: "Manage your catalog",
  subtitle:
    "Keep inventory accurate so buyers always see the right stock and price.",
  tips: [
    {
      title: "Search before you scroll",
      description:
        "Use the search box to jump to a product by name or SKU instead of paging through the full catalog.",
    },
    {
      title: "Filter by category and brand",
      description:
        "Narrow the table with Category and Brand when you're checking stock across a specific product line.",
    },
    {
      title: "Watch the price range",
      description:
        "Drag the price slider to spot outliers — items priced far above or below the rest of their category are worth a second look.",
    },
    {
      title: "Sync pulls the latest feed",
      description:
        "'Sync Products Now' refreshes stock and pricing from your connected supplier feed. Run it after a known supplier update, not on every visit.",
    },
    {
      title: "Deleting is permanent",
      description:
        "Removing a product can't be undone. Set stock to zero or archive it instead if you just want to hide it temporarily.",
    },
  ],
};