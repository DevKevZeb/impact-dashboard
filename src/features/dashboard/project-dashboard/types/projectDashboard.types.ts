export interface ProjectDashboardRow {
  id: number;
  country: string | null;
  measure: string | null;
  program_title: string | null;
  project_title: string;
  lead_project_manager: string | null;
  lead_implementing_agency: string | null;
  budget: number;
  start_date: string;
  end_date: string;
  progress: number;
  weight: number;
  comment: string | null;
  can_edit: boolean;
}
