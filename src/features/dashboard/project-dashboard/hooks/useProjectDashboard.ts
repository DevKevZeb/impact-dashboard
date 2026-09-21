import type { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProjectDashboardPaginated,
  getProjectDashboardPaginatedByCountry,
  updateProjectDashboardProgress,
  updateProjectDashboardWeight,
} from "../services/projectDashboard.api";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/authStore";

export function useProjectDashboard(page: number, perPage: number, search: string) {
  const userId = useAuthStore((state) => state.user?.id ?? 0);
  const countryUserRoleId = useAuthStore((state) => state.countryUserRoleId ?? 0);

  return useQuery({
    queryKey: ["project-dashboard", userId, countryUserRoleId, page, perPage, search],
    queryFn: () => getProjectDashboardPaginated(page, perPage, search),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 10,
  });
}

export function useProjectDashboardByCountry(
  countryId: number,
  page: number,
  perPage: number,
  search: string
) {
  return useQuery({
    queryKey: ["project-dashboard", "country", countryId, page, perPage, search],
    queryFn: () => getProjectDashboardPaginatedByCountry(countryId, page, perPage, search),
    enabled: countryId > 0,
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
    onError: (error: AxiosError<{ message?: string }>) => {
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
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error?.response?.data?.message ?? "Failed to update project weight";
      toast.error("Error updating weight", { description: message });
    },
  });
}
