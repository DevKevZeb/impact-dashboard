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
  InviteCandidatesResponse,
  InviteProgramListResponse,
  InviteProgram,
} from "../types/program.types";
import type { PaginatedResult } from "@/shared/components/AsyncSearchSelect/asyncSearch.type";

const PROGRAMS_ENDPOINT = "/programs";
const ASSIGNMENTS_ENDPOINT = "/program_country_user_roles";
const INVITES_ENDPOINT = "/invite_programs";

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

  getPaginatedByCountry: async (
    countryId: number,
    page: number,
    perPage: number,
    search: string = ""
  ) => {
    const { data } = await apiClient.get<ApiResponse<ProgramPaginatedResponse>>(
      PROGRAMS_ENDPOINT,
      {
        params: {
          page,
          per_page: perPage,
          country_id: countryId,
          ...(search ? { search } : {}),
        },
      }
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
      formData
    );
    return data.data;
  },

  update: async (id: number, input: ProgramUpdateInput): Promise<Program> => {
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    if (input.contact.id) {
      formData.append("contact[id]", input.contact.id.toString());
    }
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

    const { data } = await apiClient.put<ApiResponse<Program>>(
      `${PROGRAMS_ENDPOINT}/${id}`,
      formData
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

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${PROGRAMS_ENDPOINT}/${id}`);
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

export const inviteProgramService = {
  getCandidates: async ({
    programCountryUserRoleId,
    page = 1,
    perPage = 10,
    search,
  }: {
    programCountryUserRoleId: number;
    page?: number;
    perPage?: number;
    search?: string;
  }) => {
    const { data } = await apiClient.get<ApiResponse<InviteCandidatesResponse>>(
      `${INVITES_ENDPOINT}/candidates`,
      {
        params: {
          program_country_user_role_id: programCountryUserRoleId,
          page,
          per_page: perPage,
          ...(search ? { search } : {}),
        },
      }
    );

    return {
      candidates: data.data.candidates,
      pagination: {
        current_page: data.data.current_page,
        last_page: data.data.last_page,
        per_page: data.data.per_page,
        total: data.data.total,
      },
    };
  },

  getByOwnerAssignment: async ({
    programCountryUserRoleId,
    perPage = 100,
  }: {
    programCountryUserRoleId: number;
    perPage?: number;
  }) => {
    const { data } = await apiClient.get<ApiResponse<InviteProgramListResponse>>(
      INVITES_ENDPOINT,
      {
        params: {
          program_country_user_role_id: programCountryUserRoleId,
          per_page: perPage,
        },
      }
    );

    return data.data.invites;
  },

  create: async (payload: {
    program_country_user_role_id: number;
    invited_user_role_id: number;
  }): Promise<InviteProgram> => {
    const { data } = await apiClient.post<ApiResponse<InviteProgram>>(
      INVITES_ENDPOINT,
      payload
    );

    return data.data;
  },

  delete: async (inviteId: number): Promise<void> => {
    await apiClient.delete(`${INVITES_ENDPOINT}/${inviteId}`);
  },
};
