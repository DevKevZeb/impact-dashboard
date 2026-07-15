import type { ContributionData } from "../types/progress.selected.type";

export function mapContributionToChartData(list: ContributionData[] = []): { id: number; name: string; implementation: number }[] {
  return list.map((c) => ({ id: c.id, name: c.name, implementation: c.contribution }));
}
