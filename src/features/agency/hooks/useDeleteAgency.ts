import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAgency } from "../services/agency.api";

export function useDeleteAgency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteAgency(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
    },
    onError: () => {
      // Error toasts are handled in AgencyListPage to support status-specific UX.
    },
  });
}
