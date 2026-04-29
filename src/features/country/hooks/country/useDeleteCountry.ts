import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCountry } from "../../services/country.api";

export function useDeleteCountry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCountry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    },
    onError: () => {
      // Status-specific errors are handled in the page for better UX.
    },
  });
}