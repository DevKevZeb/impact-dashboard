import type { KPA } from "../../projects/types/kpa.type";
import type { Measure } from "../../projects/types/measure.type";
import type { StrategicOutput } from "../../projects/types/strategic.output.type";
import type { Country } from "../../projects/types/country.type";
import type { ProgramState } from "./program.state.type";

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

export interface PublicProgramsPaginatedResponse {
  programs: PublicProgramCard[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
