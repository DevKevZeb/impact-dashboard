import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteStrategicOutput } from "../services/strategic-output.api";

export function useDeleteStrategicOutput() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteStrategicOutput(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["strategic-outputs"] });
      toast.success("Strategic output deleted successfully");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error?.response?.data?.message ?? "Failed to delete strategic output";
      toast.error("Error deleting strategic output", { description: message });
    },
  });
}
