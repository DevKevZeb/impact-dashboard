import { publicApiClient } from "@/shared/lib/axios.public";
import type { findDTO } from "../types/findDTO";
import { mapProject, mapProjectCards } from "../mappers/project.mapper";

export async function getPaginatedProjects(page: number, per_page: number, filters: findDTO | null, programId?: number) {
  const params = new URLSearchParams();

  params.append("page", String(page));
  params.append("per_page", String(per_page));
  params.append("sort", filters?.sort ?? "date_newest");
  if (programId) params.append("program_id", String(programId));

  if (filters?.search) params.append("search", filters.search);
  
  const payload: Partial<findDTO> = {};

  if (filters?.country) payload.country = filters.country;
  if (filters?.kpa) payload.kpa = filters.kpa;
  if (filters?.strategic_output) payload.strategic_output = filters.strategic_output;
  if (filters?.measure) payload.measure = filters.measure;
  if (filters?.project_state) payload.project_state = filters.project_state;

  const finalPayload = Object.keys(payload).length > 0 ? payload : null;

  const { data } = await publicApiClient.post( `/projects?${params.toString()}`, finalPayload );

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

export async function getProjectsByProjectId(projectId: number){
    const { data } = await publicApiClient.get(`/projects/${projectId}`);
    return mapProject(data.data);
}