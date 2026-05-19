import { apiClient } from "@/shared/lib/axios";
import { mapProjectDashboardRows } from "../mappers/projectDashboard.mapper";

export async function getProjectDashboardPaginated(page: number, perPage: number, search: string) {
  const { data } = await apiClient.get(
    `/projects/dashboard?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}`
  );

  return {
    rows: mapProjectDashboardRows(data.data.projects),
    pagination: {
      current_page: data.data.current_page,
      last_page: data.data.last_page,
      per_page: data.data.per_page,
      total: data.data.total,
    },
  };
}

export async function getProjectDashboardPaginatedByCountry(
  countryId: number,
  page: number,
  perPage: number,
  search: string
) {
  const { data } = await apiClient.get(
    `/projects/dashboard?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}&country_id=${countryId}`
  );

  return {
    rows: mapProjectDashboardRows(data.data.projects),
    pagination: {
      current_page: data.data.current_page,
      last_page: data.data.last_page,
      per_page: data.data.per_page,
      total: data.data.total,
    },
  };
}

export async function updateProjectDashboardProgress(projectId: number, progress: number) {
  const { data } = await apiClient.patch(`/projects/${projectId}/dashboard-progress`, {
    progress,
  });

  return data.data as { id: number; progress: number };
}

export async function updateProjectDashboardWeight(projectId: number, weight: number) {
  const { data } = await apiClient.patch(`/projects/${projectId}/dashboard-weight`, {
    weight,
  });

  return data.data as { id: number; weight: number };
}
