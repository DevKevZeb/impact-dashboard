import { useQuery } from "@tanstack/react-query";
import { getPaginatedProjects, getProjectsByProjectId } from "../services/projects.api";

export function useProjects( page: number, per_page: number, filters: any ) {
  return useQuery({
    queryKey: ["projects", "list", page, per_page, filters],
    queryFn: () => getPaginatedProjects(page, per_page, filters),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 10,
  });
}

export function useProject(id?: number) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectsByProjectId(id!),
    enabled: !!id, 
    staleTime: 0,
    refetchOnMount: "always",
  });
}