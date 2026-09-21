import type { ProjectDashboardRow } from "../types/projectDashboard.types";

export function mapProjectDashboardRow(raw: Record<string, unknown>): ProjectDashboardRow {
  return {
    id: Number(raw.id),
    country: (raw.country as string | null | undefined) ?? null,
    currency_code: (raw.currency_code as string | undefined) ?? "",
    measure: (raw.measure as string | null | undefined) ?? null,
    program_title: (raw.program_title as string | null | undefined) ?? null,
    project_title: (raw.project_title as string | undefined) ?? "",
    lead_project_manager: (raw.lead_project_manager as string | null | undefined) ?? null,
    lead_implementing_agency: (raw.lead_implementing_agency as string | null | undefined) ?? null,
    budget: Number(raw.budget ?? 0),
    start_date: raw.start_date as string,
    end_date: raw.end_date as string,
    progress: Number(raw.progress ?? 0),
    weight: Number(raw.weight ?? 0),
    has_bottom_up_indicator: Boolean(raw.has_bottom_up_indicator),
    comment: (raw.comment as string | null | undefined) ?? null,
    can_edit: Boolean(raw.can_edit),
    can_edit_weight: Boolean(raw.can_edit_weight),
  };
}

export function mapProjectDashboardRows(rawList: unknown[]): ProjectDashboardRow[] {
  return rawList.map((raw) => mapProjectDashboardRow(raw as Record<string, unknown>));
}
