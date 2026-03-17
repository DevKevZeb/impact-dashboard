import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { rolesPermissionsService } from "./rolesPermissions.service";

export const rolesPermissionsKeys = {
  all: ["roles-permissions"] as const,
  roles: () => [...rolesPermissionsKeys.all, "roles"] as const,
  permissions: () => [...rolesPermissionsKeys.all, "permissions"] as const,
  rolePermissions: (roleId: number) =>
    [...rolesPermissionsKeys.all, "role-permissions", roleId] as const,
};

export function useRoles() {
  return useQuery({
    queryKey: rolesPermissionsKeys.roles(),
    queryFn: rolesPermissionsService.getRoles,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: rolesPermissionsKeys.permissions(),
    queryFn: rolesPermissionsService.getPermissions,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRolePermissions(roleId: number) {
  return useQuery({
    queryKey: rolesPermissionsKeys.rolePermissions(roleId),
    queryFn: () => rolesPermissionsService.getRolePermissions(roleId),
    staleTime: 60 * 1000,
    enabled: roleId > 0,
  });
}

export function useAssignPermissionToRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissionId }: { roleId: number; permissionId: number }) =>
      rolesPermissionsService.assignPermissionToRole(roleId, permissionId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: rolesPermissionsKeys.rolePermissions(variables.roleId),
      });
      toast.success("Permission assigned successfully");
    },
    onError: (error) => {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to assign permission";
      toast.error(message);
    },
  });
}

export function useRemovePermissionFromRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissionId }: { roleId: number; permissionId: number }) =>
      rolesPermissionsService.removePermissionFromRole(roleId, permissionId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: rolesPermissionsKeys.rolePermissions(variables.roleId),
      });
      toast.success("Permission removed successfully");
    },
    onError: (error) => {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to remove permission";
      toast.error(message);
    },
  });
}
