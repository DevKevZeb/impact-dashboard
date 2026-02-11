import { useQuery } from "@tanstack/react-query";
import { getProjectPaginatedByProgramId, getProjectsByProjectId } from "../services/project.api";

export function useProjects( page: number, perPage: number, programId: number, search: string ) {
  return useQuery({
    queryKey: ["projects", programId, page, perPage, search],
    queryFn: () => getProjectPaginatedByProgramId(page, perPage, programId, search),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 10,
  });
}

export function useProject(projectId?: number) {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectsByProjectId(projectId!),
    enabled: !!projectId, 
    staleTime: 0,
    refetchOnMount: "always",
  });
}