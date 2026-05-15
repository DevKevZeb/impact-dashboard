import { apiClient } from "@/shared/lib/axios";
import type {
  JoinRequest,
  ReviewDecisionRequest,
  ApiResponse,
  CountriesListResponse,
  JoinRequestsListResponse,
} from "../types";

export const countryJoinRequestService = {
  // Listar países activos (público)
  getActiveCountries: async (params?: { per_page?: number; page?: number }) => {
    const response = await apiClient.get<ApiResponse<CountriesListResponse>>(
      "/countries",
      { params: { active: 1, ...params } }
    );
    return response.data;
  },

  // Listar solicitudes de join (autenticado)
  getJoinRequests: async (params?: { per_page?: number; page?: number; status?: string }) => {
    const response = await apiClient.get<ApiResponse<JoinRequestsListResponse>>(
      "/country-join-requests",
      { params }
    );
    return response.data;
  },

  // Obtener una solicitud específica
  getJoinRequest: async (id: number) => {
    const response = await apiClient.get<ApiResponse<{ request: JoinRequest }>>(
      `/country-join-requests/${id}`
    );
    return response.data;
  },

  // Buscar solicitudes
  searchJoinRequests: async (query: string, params?: { per_page?: number }) => {
    const response = await apiClient.get<ApiResponse<JoinRequestsListResponse>>(
      "/country-join-requests/search",
      { params: { q: query, ...params } }
    );
    return response.data;
  },

  // Crear nueva solicitud de join
  createJoinRequest: async (countryId: number) => {
    const response = await apiClient.post<ApiResponse<{ request: JoinRequest }>>(
      "/country-join-requests",
      { country_id: countryId }
    );
    return response.data;
  },

  // Revisar solicitud (approve, reject, revoke)
  reviewJoinRequest: async (id: number, decision: ReviewDecisionRequest) => {
    const response = await apiClient.put<ApiResponse<{ request: JoinRequest }>>(
      `/country-join-requests/${id}`,
      decision
    );
    return response.data;
  },
};
