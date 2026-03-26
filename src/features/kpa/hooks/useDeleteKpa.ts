import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteKpa } from "../services/kpa.api";

export function useDeleteKpa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteKpa(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kpas"] });
      toast.success("KPA deleted successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? "Failed to delete KPA";
      toast.error("Error deleting KPA", { description: message });
    },
  });
}
