/**
 * Mocks for /roles and /permissions.
 */
import type MockAdapter from "axios-mock-adapter";
import type { AxiosRequestConfig } from "axios";
import { makeApiResponse, makeErrorResponse, parseBody } from "../fixtures/factories";
import { roles, permissions, rolePermissionIds } from "../fixtures/seed";

export function registerRolesPermissionsHandlers(mock: MockAdapter): void {
  mock.onGet("/roles").reply(() => [200, makeApiResponse(roles)]);

  mock.onGet("/permissions").reply(() => [200, makeApiResponse(permissions)]);

  mock.onGet(/^\/roles\/\d+\/permissions$/).reply((config: AxiosRequestConfig) => {
    const roleId = Number(config.url!.match(/\/roles\/(\d+)\/permissions/)![1]);
    const ids = rolePermissionIds[roleId] ?? [];
    return [200, makeApiResponse(permissions.filter((p) => ids.includes(p.id)))];
  });

  mock.onPost(/^\/roles\/\d+\/permissions$/).reply((config: AxiosRequestConfig) => {
    const roleId = Number(config.url!.match(/\/roles\/(\d+)\/permissions/)![1]);
    const body = parseBody<{ permission_id?: number }>(config.data);
    const role = roles.find((r) => r.id === roleId);
    if (!role) return [404, makeErrorResponse("Role not found.")];
    const permissionId = Number(body.permission_id);
    if (!permissions.some((p) => p.id === permissionId)) {
      return [422, makeErrorResponse("The given data was invalid.", { permission_id: ["Permission not found."] })];
    }
    const current = rolePermissionIds[roleId] ?? [];
    if (!current.includes(permissionId)) rolePermissionIds[roleId] = [...current, permissionId];
    return [200, makeApiResponse(role, "Permission assigned to role successfully")];
  });

  mock.onDelete(/^\/roles\/\d+\/permissions\/\d+$/).reply((config: AxiosRequestConfig) => {
    const match = config.url!.match(/\/roles\/(\d+)\/permissions\/(\d+)/)!;
    const roleId = Number(match[1]);
    const permissionId = Number(match[2]);
    const role = roles.find((r) => r.id === roleId);
    if (!role) return [404, makeErrorResponse("Role not found.")];
    rolePermissionIds[roleId] = (rolePermissionIds[roleId] ?? []).filter((id) => id !== permissionId);
    return [200, makeApiResponse(role, "Permission removed from role successfully")];
  });
}
