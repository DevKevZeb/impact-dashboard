import { apiClient, type ApiResponse } from "@/shared/lib/axios";
import type {
  Program,
  Contact,
  ProgramCreateInput,
  ProgramUpdateInput,
  ProgramPaginatedResponse,
  ProgramAssignmentList,
  ProgramAssignment,
  CreateAssignmentPayload,
} from "../types/program.types";
import type { PaginatedResult } from "@/shared/components/AsyncSearchSelect/asyncSearch.type";

const PROGRAMS_ENDPOINT = "/programs";
const ASSIGNMENTS_ENDPOINT = "/program_country_user_roles";

export const programService = {
  getPaginated: async (page: number, perPage: number) => {
    const { data } = await apiClient.get<ApiResponse<ProgramPaginatedResponse>>(
      PROGRAMS_ENDPOINT,
      { params: { page, per_page: perPage } }
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
    formData.append("_method", "PUT");
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("contact_id", input.contact_id.toString());
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

  search: async (name: string): Promise<Program[]> => {
    const { data } = await apiClient.get<ApiResponse<{ programs: Program[] }>>(
      `${PROGRAMS_ENDPOINT}/search`,
      { params: { name } }
    );
    return data.data.programs;
  },
};

export const assignmentService = {
  getByCountryUserRole: async (
    countryUserRoleId: number,
    page = 1,
    perPage = 10
  ) => {
    const { data } = await apiClient.get<ApiResponse<ProgramAssignmentList>>(
      ASSIGNMENTS_ENDPOINT,
      { params: { country_user_role_id: countryUserRoleId, page, per_page: perPage } }
    );
    return {
      assignments: data.data.assignments,
      pagination: {
        current_page: data.data.current_page,
        last_page: data.data.last_page,
        per_page: data.data.per_page,
        total: data.data.total,
      },
    };
  },

  create: async (payload: CreateAssignmentPayload): Promise<ProgramAssignment> => {
    const { data } = await apiClient.post<ApiResponse<ProgramAssignment>>(
      ASSIGNMENTS_ENDPOINT,
      payload
    );
    return data.data;
  },

  delete: async (pivotId: number): Promise<void> => {
    await apiClient.delete(`${ASSIGNMENTS_ENDPOINT}/${pivotId}`);
  },
};

export const contactSearchService = {
  search: async ({ query, page, limit }: { query: string; page: number; limit: number }): Promise<PaginatedResult<Contact>> => {
    const { data } = await apiClient.get<
      ApiResponse<{
        contacts: Contact[];
        current_page: number;
        last_page: number;
      }>
    >(`/contacts`, { params: { search: query, page, per_page: limit } });
    return {
      items: data.data.contacts,
      hasMore: data.data.current_page < data.data.last_page,
    };
  },
};
