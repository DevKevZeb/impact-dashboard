import { apiClient, type ApiResponse } from "@/shared/lib/axios";
import type { Permission, Role } from "../types/rolesPermissions.types";

const ROLES_ENDPOINT = "/roles";
const PERMISSIONS_ENDPOINT = "/permissions";

export const rolesPermissionsService = {
  getRoles: async (): Promise<Role[]> => {
    const { data } = await apiClient.get<ApiResponse<Role[]>>(ROLES_ENDPOINT);
    return data.data;
  },

  getPermissions: async (): Promise<Permission[]> => {
    const { data } = await apiClient.get<ApiResponse<Permission[]>>(
      PERMISSIONS_ENDPOINT
    );
    return data.data;
  },

  getRolePermissions: async (roleId: number): Promise<Permission[]> => {
    const { data } = await apiClient.get<ApiResponse<Permission[]>>(
      `${ROLES_ENDPOINT}/${roleId}/permissions`
    );
    return data.data;
  },

  assignPermissionToRole: async (
    roleId: number,
    permissionId: number
  ): Promise<Role> => {
    const { data } = await apiClient.post<ApiResponse<Role>>(
      `${ROLES_ENDPOINT}/${roleId}/permissions`,
      {
        permission_id: permissionId,
      }
    );
    return data.data;
  },

  removePermissionFromRole: async (
    roleId: number,
    permissionId: number
  ): Promise<Role> => {
    const { data } = await apiClient.delete<ApiResponse<Role>>(
      `${ROLES_ENDPOINT}/${roleId}/permissions/${permissionId}`
    );
    return data.data;
  },
};
