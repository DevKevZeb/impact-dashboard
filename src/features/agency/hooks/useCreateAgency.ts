import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAgency } from "../services/agency.api";

export function useCreateAgency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAgency,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
    },
  });
}
