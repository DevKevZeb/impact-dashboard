import { useQuery } from "@tanstack/react-query";
import { getProjectPaginatedByProgramId, getProjectsByProjectId } from "../services/project.api";

export function useProjects(page: number, perPage: number, programId: number, search:string){
    return useQuery({
        queryKey: ['projects', page, search, perPage, programId],
        queryFn: () => getProjectPaginatedByProgramId(page, perPage, programId, search)
    })
}

export function useProject(projectId?: number) {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectsByProjectId(projectId!),
    enabled: !!projectId,
  });
}