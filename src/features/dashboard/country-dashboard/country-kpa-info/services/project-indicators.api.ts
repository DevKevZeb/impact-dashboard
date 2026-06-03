import { apiClient } from "@/shared/lib/axios";

type ProjectItem = {
  progress?: number;
  weight?: number;
};

export async function fetchProjectsByIndicatorId(indicatorId: number): Promise<ProjectItem[]> {
  const { data } = await apiClient.get(`/project-indicators/projects/by-indicator/${indicatorId}`);
  return Array.isArray(data?.data?.projects) ? data.data.projects : [];
}

export function calculateIndicatorImplementation(projects: ProjectItem[], isBottomUp: boolean): number {
  if (!isBottomUp || !Array.isArray(projects) || projects.length === 0) {
    return 0;
  }

  const total = projects.reduce((sum, project) => {
    const progress = Math.max(0, Math.min(100, Number(project.progress ?? 0))) / 100;
    const weight = Math.max(0, Math.min(1, Number(project.weight ?? 0)));
    return sum + progress * weight;
  }, 0);

  return Number((total * 100).toFixed(2));
}