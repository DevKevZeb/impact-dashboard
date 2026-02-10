import { useQuery } from "@tanstack/react-query";
import { getPaginatedProjects } from "../services/projects.api";
import type { findDTO } from "../types/findDTO";

export function useProjects( page: number, per_page: number, filters: any ) {
  return useQuery({
    queryKey: ["projects", "list", page, per_page, filters],
    queryFn: () => getPaginatedProjects(page, per_page, filters),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 10,
  });
}
