import type { KPA } from "../../projects/types/kpa.type";
import type { Measure } from "../../projects/types/measure.type";
import type { StrategicOutput } from "../../projects/types/strategic.output.type";
import type { Country } from "../../projects/types/country.type";
import type { ProgramState } from "./program.state.type";
import type { Sdg } from "@/features/sdgs/types/sdg.types";

export const DEFAULT_PROGRAM_SORT = "date_newest";

export const DEFAULT_SELECT_OPTION = {
  id: 0,
  name: "",
};

export interface ProgramFindDTO {
  country: Country;
  kpa: KPA;
  strategic_output: StrategicOutput;
  measure: Measure;
  program_state: ProgramState;
  search: string;
  sort: string;
}

export const DEFAULT_PROGRAM_FILTERS: ProgramFindDTO = {
  country: DEFAULT_SELECT_OPTION,
  kpa: DEFAULT_SELECT_OPTION,
  strategic_output: DEFAULT_SELECT_OPTION,
  measure: DEFAULT_SELECT_OPTION,
  program_state: DEFAULT_SELECT_OPTION,
  search: "",
  sort: DEFAULT_PROGRAM_SORT,
};

export interface PublicProgramCard {
  id: number;
  name: string;
  description: string;
  banner_img: string;
  program_url: string;
  projects_count?: number;
}

export interface PublicProgramDetails {
  id: number;
  name: string;
  description: string;
  banner_img: string;
  sdgs: Sdg[];
  program_summary: {
    start_date: string;
    end_date: string;
    geographical_focus: Array<{
      id: number;
      name: string;
    }>;
    beneficiaries: Array<{
      id: number;
      name: string;
    }>;
    status: string;
    donors: Array<{
      id: number;
      name: string;
    }>;
    budget: number;
    implementing_agencies: Array<{
      id: number;
      name: string;
      url?: string;
    }>;
    contact_person: {
      id: number;
      first_name: string;
      last_name: string;
      title: string;
      email: string;
      phone: string;
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
