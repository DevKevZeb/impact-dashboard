import type { Sdg } from "@/features/sdgs/types/sdg.types";
import type { ProgramState } from "@/features/program-states/types/programState.types";

export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  title: string;
  email: string;
  phone?: string;
}

export interface Program {
  id: number;
  name: string;
  description: string;
  banner_img: string | null;
  program_url: string | null;
  contact: Contact;
  program_state: ProgramState;
  sdgs?: Sdg[];
  created_at?: string;
  updated_at?: string;
}

export interface ProgramCreateInput {
  name: string;
  description: string;
  banner_img?: File;
  program_url?: string;
  contact: {
    first_name: string;
    last_name: string;
    title: string;
    email: string;
    phone?: string;
  };
  sdg_ids?: number[];
}

export interface ProgramUpdateInput {
  name: string;
  description: string;
  banner_img?: File;
  program_url?: string;
  contact: {
    id: number;  // ID del contacto existente
    first_name: string;
    last_name: string;
    title: string;
    email: string;
    phone?: string;
  };
  program_state_id: number;
  sdg_ids?: number[];
}

export interface ProgramsResponse {
  programs: Program[];
  total: number;
}

export interface ProgramPaginatedResponse {
  programs: Program[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
