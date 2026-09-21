export interface StatisticsOverview {
  countries_active: number;
  countries_total: number;
  programs_total: number;
  projects_total: number;
  avg_implementation: number;
  countries: { id: number; name: string; implementation: number }[];
  kpas: { id: number; name: string; implementation: number }[];
}
