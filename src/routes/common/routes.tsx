import ApiKeys from "@/pages/apikeys";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "./routePath";
import SignIn from "@/pages/auth/sign-in";
import Overview from "@/pages/overview";
import Settings from "@/pages/settings";
import Docs from "@/pages/docs";
import Products from "@/pages/products";
import Categories from "@/pages/categories";
import Banners from "@/pages/banner";
import Brands from "@/pages/brands";

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
];

export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.OVERVIEW, element: <Overview /> },
  { path: PROTECTED_ROUTES.PRODUCTS, element: <Products /> },
  { path: PROTECTED_ROUTES.APIKEYS, element: <ApiKeys /> },
  { path: PROTECTED_ROUTES.CATEGORIES, element: <Categories /> },
  { path: PROTECTED_ROUTES.BANNER, element: <Banners /> },
  { path: PROTECTED_ROUTES.BRANDS, element: <Brands /> },
  { path: PROTECTED_ROUTES.DOCS, element: <Docs /> },
  {
    path: PROTECTED_ROUTES.SETTINGS,
    element: <Settings />,
  },
];
