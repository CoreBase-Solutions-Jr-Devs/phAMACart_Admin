import { useGetCurrentUserQuery } from "@/features/auth/authAPI";

const useAuth = () => {
  const query = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  return query;
};

export default useAuth;