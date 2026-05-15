import { useQuery } from "@tanstack/react-query";
import { countryJoinRequestService } from "../services";
import { countryJoinRequestKeys, useCountryJoinRequestContextKey } from "../api/queryKeys";

export function useActiveCountries() {
  const contextKey = useCountryJoinRequestContextKey();

  return useQuery({
    queryKey: countryJoinRequestKeys.activeCountries(contextKey),
    queryFn: () => countryJoinRequestService.getActiveCountries({ per_page: 100 }),
    staleTime: 0,
    refetchOnMount: "always",
  });
}
