import { apiClient, type ApiResponse } from "@/shared/lib/axios";
import type {
  ProgramState,
  ProgramStateCreateInput,
  ProgramStateUpdateInput,
  ProgramStatesResponse,
  ProgramStatesPaginatedResponse,
} from "../types/programState.types";

const PROGRAM_STATES_ENDPOINT = "/program_states";

export const programStateService = {
  getAll: async (): Promise<ProgramState[]> => {
    const { data } = await apiClient.get<ApiResponse<ProgramStatesResponse>>(
      PROGRAM_STATES_ENDPOINT
    );
    return data.data.program_states;
  },

  getPaginated: async (page: number, perPage: number) => {
    const { data } = await apiClient.get<ApiResponse<ProgramStatesPaginatedResponse>>(
      `${PROGRAM_STATES_ENDPOINT}?page=${page}&per_page=${perPage}`
    );
    return {
      programStates: data.data.program_states,
      pagination: {
        current_page: data.data.current_page,
        last_page: data.data.last_page,
        per_page: data.data.per_page,
        total: data.data.total,
      },
    };
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

  delete: async (id: number): Promise<{ success: boolean; message: string; data: unknown[] }> => {
    const { data } = await apiClient.delete(`${PROGRAM_STATES_ENDPOINT}/${id}`);
    return data;
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
