import { useQuery } from "@tanstack/react-query";
import { getCountryOverallImplementation } from "../services/progress.api";

export default function useCountrySelected(countryId?: number) {
  return useQuery({
    queryKey: ["country", "implementation", countryId],
    queryFn: () => getCountryOverallImplementation(countryId as number),
    enabled: Boolean(countryId),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 10,
  });
}
