import { BrowserRouter, Route, Routes } from "react-router-dom";

import {
  authenticationRoutePaths,
  protectedRoutePaths,
  devSupportRoutePaths,
} from "./common/routes";

import AppLayout from "@/layouts/app-layout";
import BaseLayout from "@/layouts/base-layout";
import AuthRoute from "./authRoute";
import ProtectedRoute from "./protectedRoute";
import useAuth from "@/hooks/use-auth";
import NotFound from "./common/NotFound";

function AppRoutes() {
  useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication Routes */}
        <Route element={<AuthRoute />}>
          <Route element={<BaseLayout />}>
            {authenticationRoutePaths.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Route>

        {/* General Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {protectedRoutePaths.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Route>

        {/* Dev / Support Protected Routes */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["Dev", "Support"]}
            />
          }
        >
          <Route element={<AppLayout />}>
            {devSupportRoutePaths.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;