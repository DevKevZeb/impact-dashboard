import { apiClient } from "@/shared/lib/axios";
import { mapProject, mapProjectsTable } from "../mappers/project.mapper";

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
    console.log("Raw project data:", data.data);
    return mapProject(data.data);
}