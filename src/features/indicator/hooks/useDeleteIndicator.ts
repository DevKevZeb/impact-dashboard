import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteIndicator } from "../services/indicator.api";
import { toast } from "sonner";

export function useDeleteIndicator(measureId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteIndicator(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["indicators"] });
      if (measureId) {
        queryClient.invalidateQueries({ queryKey: ["indicators", measureId] });
      }
      toast.success("Indicator deleted successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? "Failed to delete indicator";
      toast.error("Error deleting indicator", { description: message });
    },
  });
}
