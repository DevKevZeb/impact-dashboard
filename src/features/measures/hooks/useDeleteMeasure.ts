import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteMeasure } from "../services/measure.api";

export function useDeleteMeasure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMeasure(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measures"] });
      toast.success("Measure deleted successfully");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error?.response?.data?.message ?? "Failed to delete measure";
      toast.error("Error deleting measure", { description: message });
    },
  });
}
