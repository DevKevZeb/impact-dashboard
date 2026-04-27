import type { User, UserListResponse } from "../types/user.types";

// DTO matches backend response structure
export interface UserDTO {
  id: number;
  name: string;
  email: string;
  user_role_id?: number;
  roles: Array<{ id: number; name: string; guard_name?: string }> | null;
  userState?: { id: number; name: string } | null;   // camelCase (some endpoints)
  user_state?: { id: number; name: string } | null;  // snake_case (standard Laravel)
  countries?: Array<{ id: number; name: string }> | null;  // legacy field
  country_user_role?: { id: number; country: { id: number; name: string } | null } | null;
  created_at: string;
  updated_at: string;
}

export interface UserListResponseDTO {
  users: UserDTO[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export function mapUserFromDTO(dto: UserDTO): User {
  const state = dto.userState ?? dto.user_state;
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    userRoleId: dto.user_role_id ?? 0,
    roles: (dto.roles ?? []).map(role => ({
      id: role.id,
      name: role.name,
    })),
    userState: {
      id: state?.id ?? 0,
      name: state?.name ?? "Unknown",
    },
    countries: dto.countries
      ? dto.countries.map(country => ({ id: country.id, name: country.name }))
      : dto.country_user_role?.country
        ? [{ id: dto.country_user_role.country.id, name: dto.country_user_role.country.name }]
        : [],
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapUserListFromDTO(dto: UserListResponseDTO): UserListResponse {
  return {
    users: (dto.users ?? []).map(mapUserFromDTO),
    pagination: {
      total: dto.total ?? 0,
      per_page: dto.per_page ?? 10,
      current_page: dto.current_page ?? 1,
      last_page: dto.last_page ?? 1,
    },
  };
}
