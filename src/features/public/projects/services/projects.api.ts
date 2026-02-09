import { publicApiClient } from "@/shared/lib/axios.public";
import type { findDTO } from "../types/findDTO";
import { mapProjectCards } from "../mappers/project.mapper";

export async function getPaginatedProjects( page: number, per_page: number, filters: findDTO | null ) {
  const params = new URLSearchParams();

  params.append("page", String(page));
  params.append("per_page", String(per_page));

  if (filters?.search) params.append("search", filters.search);
  
  const payload = filters ? { country: filters.country ?? null, kpa: filters.kpa ?? null, strategic_output: filters.strategic_output ?? null, measure: filters.measure ?? null, project_state: filters.project_state ?? null } : undefined;
  const { data } = await publicApiClient.post( `/projects?${params.toString()}`, payload );

  return {
    projects: mapProjectCards(data.data.projects),
    pagination: {
      current_page: data.data.current_page,
      last_page: data.data.last_page,
      per_page: data.data.per_page,
      total: data.data.total,
    },
  };
}
