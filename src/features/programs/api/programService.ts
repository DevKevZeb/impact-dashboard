import { apiClient, type ApiResponse } from "@/shared/lib/axios";
import type {
  Program,
  ProgramCreateInput,
  ProgramUpdateInput,
  ProgramsResponse,
  ProgramPaginatedResponse,
} from "../types/program.types";

const PROGRAMS_ENDPOINT = "/programs";

export const programService = {
  getAll: async (): Promise<Program[]> => {
    const { data } = await apiClient.get<ApiResponse<ProgramsResponse>>(
      PROGRAMS_ENDPOINT
    );
    return data.data.programs;
  },

  getPaginated: async (page: number, perPage: number) => {
    const { data } = await apiClient.get<ApiResponse<ProgramPaginatedResponse>>(
      `${PROGRAMS_ENDPOINT}?page=${page}&per_page=${perPage}`
    );
    return {
      programs: data.data.programs,
      pagination: {
        current_page: data.data.current_page,
        last_page: data.data.last_page,
        per_page: data.data.per_page,
        total: data.data.total,
      },
    };
  },

  getById: async (id: number): Promise<Program> => {
    const { data } = await apiClient.get<ApiResponse<Program>>(
      `${PROGRAMS_ENDPOINT}/${id}`
    );
    return data.data;
  },

  create: async (input: ProgramCreateInput): Promise<Program> => {
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    
    // Contact como objeto anidado (FormData syntax)
    formData.append("contact[first_name]", input.contact.first_name);
    formData.append("contact[last_name]", input.contact.last_name);
    formData.append("contact[title]", input.contact.title);
    formData.append("contact[email]", input.contact.email);
    if (input.contact.phone) {
      formData.append("contact[phone]", input.contact.phone);
    }

    if (input.banner_img) {
      formData.append("banner_img", input.banner_img);
    }

    if (input.program_url) {
      formData.append("program_url", input.program_url);
    }

    if (input.sdg_ids && input.sdg_ids.length > 0) {
      input.sdg_ids.forEach((id, index) => {
        formData.append(`sdg_ids[${index}]`, id.toString());
      });
    }

    const { data } = await apiClient.post<ApiResponse<Program>>(
      PROGRAMS_ENDPOINT,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data.data;
  },

  update: async (id: number, input: ProgramUpdateInput): Promise<Program> => {
    const formData = new FormData();
    formData.append("_method", "PUT"); // Laravel method spoofing
    formData.append("name", input.name);
    formData.append("description", input.description);
    
    // Contact como objeto anidado (FormData syntax) - incluye ID
    formData.append("contact[id]", input.contact.id.toString());
    formData.append("contact[first_name]", input.contact.first_name);
    formData.append("contact[last_name]", input.contact.last_name);
    formData.append("contact[title]", input.contact.title);
    formData.append("contact[email]", input.contact.email);
    if (input.contact.phone) {
      formData.append("contact[phone]", input.contact.phone);
    }

    formData.append("program_state_id", input.program_state_id.toString());

    if (input.banner_img) {
      formData.append("banner_img", input.banner_img);
    }

    if (input.program_url) {
      formData.append("program_url", input.program_url);
    }

    if (input.sdg_ids && input.sdg_ids.length > 0) {
      input.sdg_ids.forEach((id, index) => {
        formData.append(`sdg_ids[${index}]`, id.toString());
      });
    }

    const { data } = await apiClient.post<ApiResponse<Program>>(
      `${PROGRAMS_ENDPOINT}/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data.data;
  },

  search: async (name: string): Promise<Program> => {
    const { data } = await apiClient.get<ApiResponse<Program>>(
      `${PROGRAMS_ENDPOINT}/search`,
      { params: { name } }
    );
    return data.data;
  },
};
