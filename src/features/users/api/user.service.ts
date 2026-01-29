import { apiClient, type ApiResponse } from "@/shared/lib/axios";
import { mapUserListFromDTO, mapUserFromDTO, type UserDTO, type UserListResponseDTO } from "../mappers/user.mapper";
import type { User, UserListResponse } from "../types/user.types";

const USERS_ENDPOINT = "/users";

export const userService = {
  getPendingUsers: async (page: number = 1, perPage: number = 10): Promise<UserListResponse> => {
    const { data } = await apiClient.get<ApiResponse<UserListResponseDTO>>(
      `${USERS_ENDPOINT}/pending`,
      {
        params: { page, per_page: perPage },
      }
    );
    return mapUserListFromDTO(data.data);
  },

  getAllUsers: async (page: number = 1, perPage: number = 10): Promise<UserListResponse> => {
    const { data } = await apiClient.get<ApiResponse<UserListResponseDTO>>(USERS_ENDPOINT, {
      params: { page, per_page: perPage },
    });
    return mapUserListFromDTO(data.data);
  },

  approveUser: async (userId: number): Promise<User> => {
    const { data } = await apiClient.post<ApiResponse<UserDTO>>(
      `${USERS_ENDPOINT}/${userId}/approve`
    );
    return mapUserFromDTO(data.data);
  },

  rejectUser: async (userId: number): Promise<void> => {
    await apiClient.delete(`${USERS_ENDPOINT}/${userId}/reject`);
  },
};
