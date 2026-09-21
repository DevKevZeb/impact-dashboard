import type { AxiosError } from "axios";
import { apiClient } from "@/shared/lib/axios";
import { mapProjectState, mapProjectStates } from "../mappers/projectstate.mapper";
import type { ProjectState, ProjectStateDTO } from "../types/projectstate.types";
import { toast } from "sonner";

export async function getProjectStatesPaginated(page: number, perPage: number, search: string) {
  const { data } = await apiClient.get(`/project-states?search=${encodeURIComponent(search)}&page=${page}&per_page=${perPage}`);
  return {
    project_states: mapProjectStates(data.data.project_states),
    pagination: {
      current_page: data.data.current_page,
      last_page: data.data.last_page,
      per_page: data.data.per_page,
      total: data.data.total
    }
  };
}

export async function getProjectState(id: number): Promise<ProjectState>{
    const { data } = await apiClient.get(`/project-states/${id}`);
    return mapProjectState(data.data ?? data);
}

export async function createProjectState(dto: ProjectStateDTO): Promise<ProjectState>{
    try{
        const payload = {state: dto.state}
        const { data } = await apiClient.post("/project-states", payload);
        toast.success(data.message)

        return mapProjectState(data.data ?? data);
    } catch(error: unknown) {
      const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
      const status = axiosError.response?.status;

      if (status === 422 && axiosError.response?.data?.errors) {
        const errors = axiosError.response.data.errors;
        Object.values(errors).flat().forEach((msg: string) => {
          toast.error('Error', { description: msg });
        });
      }
      throw error;
    }
}

export async function updateProjectState(id: number, dto: ProjectStateDTO): Promise<ProjectState>{
    try{
        const payload = { state: dto.state};
        const {data} = await apiClient.put(`/project-states/${id}`, payload);
        toast.success(data.message);

        return mapProjectState(data.data ?? data);
    }catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
    const status = axiosError.response?.status;

    if (status === 422 && axiosError.response?.data?.errors) {
      const errors = axiosError.response.data.errors;
      Object.values(errors).flat().forEach((msg: string) => {
        toast.error('Error', { description: msg });
      });
    }

    throw error;
  }
}

export async function fetchSearchProjectStates(search: string, page: number, per_page: number){
  const { data } = await apiClient.get(`/project-states?search=${encodeURIComponent(search)}&page=${page}&per_page=${per_page}`);

  return {
    project_states: mapProjectStates(data.data.project_states),
    pagination: {
      current_page: data.data.current_page,
      last_page: data.data.last_page,
      per_page: data.data.per_page,
      total: data.data.total
    }
  }
}

export async function fetchProjectStatesForSelector(params: { query: string, page: number, limit: number }){
  const { query, page, limit } = params;

  const data = await fetchSearchProjectStates(query, page, limit);

  return {
    items: data.project_states,
    hasMore: data.pagination.current_page < data.pagination.last_page
  }
}

export async function deleteProjectState(id: number): Promise<void> {
  try {
    await apiClient.delete(`/project-states/${id}`);
    return;
  } catch (error: unknown) {
    // Let callers handle user-facing notifications; rethrow for caller handling
    throw error;
  }
}
