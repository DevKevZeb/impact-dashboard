import type { KPA } from "../../projects/types/kpa.type";
import type { Measure } from "../../projects/types/measure.type";
import type { StrategicOutput } from "../../projects/types/strategic.output.type";
import type { Country } from "../../projects/types/country.type";
import type { ProgramState } from "./program.state.type";
import type { Sdg } from "@/features/sdgs/types/sdg.types";

export interface ProgramFindDTO {
  country: Country | null;
  kpa: KPA | null;
  strategic_output: StrategicOutput | null;
  measure: Measure | null;
  program_state: ProgramState | null;
  search: string | null;
  sort: string | null;
}

export interface PublicProgramCard {
  id: number;
  name: string;
  description: string;
  banner_img: string | null;
  program_url: string | null;
  projects_count?: number;
}

export interface PublicProgramDetails {
  id: number;
  name: string;
  description: string;
  banner_img: string | null;
  sdgs: Sdg[];
  program_summary: {
    start_date: string | null;
    end_date: string | null;
    geographical_focus: Array<{
      id: number;
      name: string;
    }>;
    beneficiaries: Array<{
      id: number;
      name: string;
    }>;
    status: string | null;
    donors: Array<{
      id: number;
      name: string;
    }>;
    budget: number;
    implementing_agencies: Array<{
      id: number;
      name: string;
      url?: string | null;
    }>;
    contact_person: {
      id: number | null;
      first_name: string | null;
      last_name: string | null;
      title: string | null;
      email: string | null;
      phone: string | null;
    };
  };
}

export interface PublicProgramsPaginatedResponse {
  programs: PublicProgramCard[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
