import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProject } from "../services/project.api";
import { toast } from "sonner";
import { programKeys } from "@/features/programs/api/programQueries";

export function useDeleteProject(programId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: number) => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", programId], exact: false });
      queryClient.invalidateQueries({ queryKey: programKeys.detail(programId) });
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? err?.message ?? "Failed to delete project";
      toast.error(message);
    },
  });
}
