import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteIndicatorType } from "../services/indicatortype.api";

export function useDeleteIndicatorType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteIndicatorType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["types"] });
      toast.success("Indicator Type deleted successfully");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error?.response?.data?.message ?? "Failed to delete indicator type";
      toast.error("Error deleting indicator type", { description: message });
    },
  });
}
