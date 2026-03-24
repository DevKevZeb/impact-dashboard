import { apiClient } from "@/shared/lib/axios";
import { mapProject, mapProjectsTable } from "../mappers/project.mapper";
import type { Project, ProjectDTO } from "../types/project.types";
import { toast } from "sonner";

function formatDateToYMD(date: string | Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}


export async function createProject(projectData: ProjectDTO): Promise<Project>{
    try{
        const payload = { ...projectData, start_date: formatDateToYMD(projectData.start_date), end_date: formatDateToYMD(projectData.end_date), };
        const { data } = await apiClient.post("/projects", payload);
        toast.success(data.message);

        return mapProject(data.data);
    } catch(error: any) {
      const status = error.response?.status;

      if (status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors as Record<string, string[]>;
        Object.values(errors).flat().forEach((msg: string) => {
          toast.error('Error', { description: msg });
        });
      }
      throw error;
    }
}

export async function updateProject(id: number, projectData: ProjectDTO): Promise<Project>{
    try{
        console.log("Updating project with data:", projectData);
        const { data } = await apiClient.put(`/projects/${id}`, projectData);
        toast.success(data.message);

        return mapProject(data.data);
    } catch(error: any) {
      const status = error.response?.status;

      if (status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors as Record<string, string[]>;
        Object.values(errors).flat().forEach((msg: string) => {
          toast.error('Error', { description: msg });
        });
      }
      throw error;
    }
}

export async function getProjectPaginatedByProgramId(page: number, perPage: number, programId: number, search: string){
    const { data } = await apiClient.get(`/projects/program/${programId}?search=${encodeURIComponent(search)}&page=${page}&per_page=${perPage}`);

    return {
        projects: mapProjectsTable(data.data.projects),
        pagination: {
            current_page: data.data.current_page,
            last_page: data.data.last_page,
            per_page: data.data.per_page,
            total: data.data.total
        }
    };
}

export async function getProjectsByProjectId(projectId: number){
    const { data } = await apiClient.get(`/projects/${projectId}`);
    return mapProject(data.data);
}

export async function deleteProject(projectId: number): Promise<void> {
  const { data } = await apiClient.delete(`/projects/${projectId}`);
  toast.success(data?.message ?? "Project deleted successfully");
}

export async function getProgramWeightAvailability(programId: number, excludeProjectId?: number) {
  const perPage = 100;
  let page = 1;
  let lastPage = 1;
  let usedWeight = 0;

  do {
    const { data } = await apiClient.get(`/projects/program/${programId}?search=&page=${page}&per_page=${perPage}`);
    const projects = data?.data?.projects ?? [];

    projects.forEach((project: any) => {
      if (excludeProjectId && Number(project.id) === Number(excludeProjectId)) return;
      usedWeight += Number(project.weight ?? 0);
    });

    lastPage = Number(data?.data?.last_page ?? page);
    page += 1;
  } while (page <= lastPage);

  const normalizedUsed = Number(usedWeight.toFixed(4));
  const availableWeight = Number(Math.max(0, 1 - normalizedUsed).toFixed(4));

  return {
    usedWeight: normalizedUsed,
    availableWeight,
  };
}