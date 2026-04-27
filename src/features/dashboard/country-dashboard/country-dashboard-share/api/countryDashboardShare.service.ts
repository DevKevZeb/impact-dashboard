import { apiClient, type ApiResponse } from "@/shared/lib/axios";
import {
  mapUserListFromDTO,
  type UserListResponseDTO,
} from "@/features/users/mappers/user.mapper";
import type { UserListResponse } from "@/features/users/types/user.types";
import type {
  CountryDashboardShare,
  CountryDashboardShareListResponse,
  CreateCountryDashboardShareInput,
} from "../types/countryDashboardShare.types";

const BASE_ENDPOINT = "/country-dashboard-shares";

export const countryDashboardShareService = {
  getAdminCandidates: async (page: number = 1, perPage: number = 50): Promise<UserListResponse> => {
    const { data } = await apiClient.get<ApiResponse<UserListResponseDTO>>(`${BASE_ENDPOINT}/admin-candidates`, {
      params: { page, per_page: perPage },
    });

    return mapUserListFromDTO(data.data);
  },

  getMyShares: async (page: number = 1, perPage: number = 50): Promise<CountryDashboardShareListResponse> => {
    const { data } = await apiClient.get<ApiResponse<CountryDashboardShareListResponse>>(
      `${BASE_ENDPOINT}/my-shares`,
      {
        params: { page, per_page: perPage },
      }
    );

    return data.data;
  },

  getVisibleForAdmin: async (page: number = 1, perPage: number = 50): Promise<CountryDashboardShareListResponse> => {
    const { data } = await apiClient.get<ApiResponse<CountryDashboardShareListResponse>>(
      `${BASE_ENDPOINT}/visible-for-admin`,
      {
        params: { page, per_page: perPage },
      }
    );

    return data.data;
  },

  createShare: async (input: CreateCountryDashboardShareInput): Promise<CountryDashboardShare> => {
    const { data } = await apiClient.post<ApiResponse<CountryDashboardShare>>(BASE_ENDPOINT, input);
    return data.data;
  },

  deleteShare: async (shareId: number): Promise<void> => {
    await apiClient.delete(`${BASE_ENDPOINT}/${shareId}`);
  },
};
