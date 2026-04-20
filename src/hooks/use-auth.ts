import { useGetCurrentUserQuery } from "@/features/auth/authAPI";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

const useAuth = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const query = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated, // ← don't fire if not authenticated
    refetchOnMountOrArgChange: true,
  });

  return query;
};

export default useAuth;