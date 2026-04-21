export const isAuthRoute = (pathname: string): boolean => {
  return Object.values(AUTH_ROUTES).includes(pathname);
};

export const AUTH_ROUTES = {
  SIGN_IN: "/",
  SIGN_UP: "/sign-up",
};

export const PROTECTED_ROUTES = {
  OVERVIEW: "/overview",
  COMPANYPROFILE: "/company-profile",
  PRODUCTS: "/products",
  CATEGORIES: "/categories",
  BANNER: "/banner",
  BRANDS: "/brands",
  STORES: "/stores",
  SETTINGS: "/settings",
};
