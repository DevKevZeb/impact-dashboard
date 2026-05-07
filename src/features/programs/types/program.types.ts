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

export interface ProgramSummaryItem {
  id: number;
  name: string;
  url?: string;
}

export interface ProgramSummary {
  donors: ProgramSummaryItem[];
  implementing_agencies: ProgramSummaryItem[];
  budget: number;
}

export interface Program {
  id: number;
  name: string;
  description: string;
  banner_img: string | null;
  program_url: string | null;
  contact: Contact;
  program_state: ProgramState;
  sdgs: Sdg[];
  program_summary?: ProgramSummary;
  created_at?: string;
  updated_at?: string;
  projects_count?: number;
  can_edit?: boolean;
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
    id?: number;
    first_name: string;
    last_name: string;
    title: string;
    email: string;
    phone?: string;
  };
  program_state_id: number;
  sdg_ids?: number[];
}

export interface ProgramAssignment {
  id: number;
  program_id: number;
  country_user_role_id: number;
  program: Program;
  country_user_role: {
    id: number;
    country: { id: number; name: string } | null;
  };
  created_at: string;
  updated_at: string;
}

export interface ProgramAssignmentList {
  assignments: ProgramAssignment[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface CreateAssignmentPayload {
  program_id: number;
  country_user_role_id: number;
}

export interface ProgramPaginatedResponse {
  programs: Program[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface InviteCandidate {
  id: number;
  name: string;
  email: string;
  agency: {
    id: number;
    name: string;
  } | null;
}

export interface InviteCandidatesResponse {
  candidates: InviteCandidate[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface InviteProgram {
  id: number;
  program_country_user_role_id: number;
  invited_user_role_id: number;
}

export interface InviteProgramListResponse {
  invites: InviteProgram[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}
