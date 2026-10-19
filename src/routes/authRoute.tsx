import { Navigate, Outlet } from "react-router-dom";
import { PROTECTED_ROUTES } from "./common/routePath";
import { useTypedSelector } from "@/app/hook";

const AuthRoute = () => {
  const { isAuthenticated } = useTypedSelector(
    (state) => state.auth
  );

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <Navigate
      to={PROTECTED_ROUTES.OVERVIEW}
      replace
    />
  );
};

export default AuthRoute;