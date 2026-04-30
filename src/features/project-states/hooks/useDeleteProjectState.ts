import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProjectState } from "../service/projectstate.api";

export function useDeleteProjectState() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProjectState(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-states"] });
    },
    onError: () => {
      // Error toasts are handled in ProjectStateListPage for status-specific UX.
    },
  });
}