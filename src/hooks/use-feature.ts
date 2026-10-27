import { useGetFeaturesQuery } from "@/features/featureFlags/featureFlagsAPI";

/** Whether an optional feature is on for this pharmacy (false while loading). */
const useFeature = (key: string): boolean => {
  const { data } = useGetFeaturesQuery();
  return data?.[key] === true;
};

export default useFeature;
