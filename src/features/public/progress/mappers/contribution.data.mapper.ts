import type { ContributionData } from "../types/progress.selected.type";

export function mapContributionToChartData(list: ContributionData[] = []): { id: number; name: string; implementation: number }[] {
  return list.map((c) => ({ id: c.id, name: c.name, implementation: c.contribution }));
}

interface KpaContribution {
  agencies?: ContributionData[];
  donors?: ContributionData[];
}

export function aggregateContributorsByKpa(kpas: KpaContribution[], key: "agencies" | "donors"): { id: number; name: string; implementation: number }[] {
  const map = new Map<number, { id: number; name: string; implementation: number }>();
  for (const kpa of kpas ?? []) {
    for (const c of kpa?.[key] ?? []) {
      const existing = map.get(c.id);
      if (existing) {
        existing.implementation += Number(c.contribution ?? 0);
      } else {
        map.set(c.id, { id: c.id, name: c.name, implementation: Number(c.contribution ?? 0) });
      }
    }
  }
  return Array.from(map.values());
}
