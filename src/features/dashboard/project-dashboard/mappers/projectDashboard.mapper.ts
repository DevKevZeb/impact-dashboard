import type { ProjectDashboardRow } from "../types/projectDashboard.types";

export function mapProjectDashboardRow(raw: any): ProjectDashboardRow {
  return {
    id: Number(raw.id),
    country: raw.country ?? null,
    measure: raw.measure ?? null,
    program_title: raw.program_title ?? null,
    project_title: raw.project_title ?? "",
    lead_project_manager: raw.lead_project_manager ?? null,
    lead_implementing_agency: raw.lead_implementing_agency ?? null,
    budget: Number(raw.budget ?? 0),
    start_date: raw.start_date,
    end_date: raw.end_date,
    progress: Number(raw.progress ?? 0),
    weight: Number(raw.weight ?? 0),
    has_bottom_up_indicator: Boolean(raw.has_bottom_up_indicator),
    comment: raw.comment ?? null,
    can_edit: Boolean(raw.can_edit),
    can_edit_weight: Boolean(raw.can_edit_weight),
  };
}

export function mapProjectDashboardRows(rawList: any[]): ProjectDashboardRow[] {
  return rawList.map(mapProjectDashboardRow);
}
