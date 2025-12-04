export interface ProgramState {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProgramStateCreateInput {
  name: string; // required, min:2, max:255, unique (backend validation)
}

export interface ProgramStateUpdateInput {
  name: string; // required, min:2, max:255, unique (backend validation)
}

export interface ProgramStatesResponse {
  program_states: ProgramState[];
  total: number;
}
