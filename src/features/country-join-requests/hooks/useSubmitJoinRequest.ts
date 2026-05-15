import { useMutation, useQueryClient } from "@tanstack/react-query";
import { countryJoinRequestService } from "../services";
import { countryJoinRequestKeys, useCountryJoinRequestContextKey } from "../api/queryKeys";

export function useSubmitJoinRequest() {
  const queryClient = useQueryClient();
  const contextKey = useCountryJoinRequestContextKey();
  return useMutation({
    mutationFn: (countryId: number) => countryJoinRequestService.createJoinRequest(countryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: countryJoinRequestKeys.list(contextKey) });
      queryClient.invalidateQueries({ queryKey: countryJoinRequestKeys.activeCountries(contextKey) });
    },
  });
}
