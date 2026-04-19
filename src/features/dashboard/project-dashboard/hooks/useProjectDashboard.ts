import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProjectDashboardPaginated,
  updateProjectDashboardProgress,
  updateProjectDashboardWeight,
} from "../services/projectDashboard.api";
import { toast } from "sonner";

export function useProjectDashboard(page: number, perPage: number, search: string) {
  return useQuery({
    queryKey: ["project-dashboard", page, perPage, search],
    queryFn: () => getProjectDashboardPaginated(page, perPage, search),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 10,
  });
}

export function useUpdateProjectDashboardProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, progress }: { projectId: number; progress: number }) =>
      updateProjectDashboardProgress(projectId, progress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-dashboard"], exact: false });
      toast.success("Project progress updated successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? "Failed to update project progress";
      toast.error("Error updating progress", { description: message });
    },
  });
}

export function useUpdateProjectDashboardWeight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, weight }: { projectId: number; weight: number }) =>
      updateProjectDashboardWeight(projectId, weight),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-dashboard"], exact: false });
      toast.success("Project weight updated successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? "Failed to update project weight";
      toast.error("Error updating weight", { description: message });
    },
  });
}
