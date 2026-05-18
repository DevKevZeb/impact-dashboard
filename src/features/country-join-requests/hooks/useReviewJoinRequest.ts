import { useMutation, useQueryClient } from "@tanstack/react-query";
import { countryJoinRequestService } from "../services";
import type { ReviewAction } from "../types";
import { countryJoinRequestKeys, useCountryJoinRequestContextKey } from "../api/queryKeys";

export function useReviewJoinRequest() {
  const queryClient = useQueryClient();
  const contextKey = useCountryJoinRequestContextKey();
  return useMutation({
    mutationFn: ({ id, action }: { id: number; action: ReviewAction }) =>
      countryJoinRequestService.reviewJoinRequest(id, { action }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: countryJoinRequestKeys.list(contextKey) });
      queryClient.invalidateQueries({ queryKey: countryJoinRequestKeys.activeCountries(contextKey) });
    },
  });
}
