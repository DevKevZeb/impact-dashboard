import { useQuery } from "@tanstack/react-query";
import { countryJoinRequestService } from "../services";
import { countryJoinRequestKeys, useCountryJoinRequestContextKey } from "../api/queryKeys";

export function useCountryJoinRequests() {
  const contextKey = useCountryJoinRequestContextKey();

  return useQuery({
    queryKey: countryJoinRequestKeys.list(contextKey),
    queryFn: () => countryJoinRequestService.getJoinRequests({ per_page: 100 }),
    staleTime: 0,
    refetchOnMount: "always",
  });
}
