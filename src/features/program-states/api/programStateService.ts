import { apiClient, type ApiResponse } from "@/shared/lib/axios";
import type {
  ProgramState,
  ProgramStateCreateInput,
  ProgramStateUpdateInput,
  ProgramStatesResponse,
} from "../types/programState.types";

const PROGRAM_STATES_ENDPOINT = "/program_states";

export const programStateService = {
  getAll: async (): Promise<ProgramState[]> => {
    const { data } = await apiClient.get<ApiResponse<ProgramStatesResponse>>(
      PROGRAM_STATES_ENDPOINT
    );
    return data.data.program_states;
  },

  getById: async (id: number): Promise<ProgramState> => {
    const { data } = await apiClient.get<ApiResponse<ProgramState>>(
      `${PROGRAM_STATES_ENDPOINT}/${id}`
    );
    return data.data;
  },

  create: async (input: ProgramStateCreateInput): Promise<ProgramState> => {
    const { data } = await apiClient.post<ApiResponse<ProgramState>>(
      PROGRAM_STATES_ENDPOINT,
      input
    );
    return data.data;
  },

  update: async (
    id: number,
    input: ProgramStateUpdateInput
  ): Promise<ProgramState> => {
    const { data } = await apiClient.put<ApiResponse<ProgramState>>(
      `${PROGRAM_STATES_ENDPOINT}/${id}`,
      input
    );
    return data.data;
  },

  search: async (name: string): Promise<ProgramState> => {
    const { data } = await apiClient.get<ApiResponse<ProgramState>>(
      `${PROGRAM_STATES_ENDPOINT}/search`,
      {
        params: { name },
      }
    );
    return data.data;
  },
};
