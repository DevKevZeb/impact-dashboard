import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDonor } from "../services/donor.api";

export function useDeleteDonor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteDonor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donors"] });
    },
    onError: () => {
      // Error toasts are handled in DonorsListPage to support status-specific UX.
    },
  });
}
