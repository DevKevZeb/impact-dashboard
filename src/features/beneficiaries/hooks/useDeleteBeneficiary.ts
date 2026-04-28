import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBeneficiary } from "../service/beneficiaries.api";

export function useDeleteBeneficiary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteBeneficiary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
    },
    onError: () => {
      // Error toasts are handled in BeneficiariesListPage for status-specific UX.
    },
  });
}