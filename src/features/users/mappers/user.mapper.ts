import type { User, UserListResponse } from "../types/user.types";

// DTO matches backend response structure (camelCase for userState)
export interface UserDTO {
  id: number;
  name: string;
  email: string;
  roles: Array<{ id: number; name: string; guard_name?: string }>;
  userState: {
    id: number;
    name: string;
  };
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
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    roles: dto.roles.map(role => ({
      id: role.id,
      name: role.name,
    })),
    userState: {
      id: dto.userState.id,
      name: dto.userState.name,
    },
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapUserListFromDTO(dto: UserListResponseDTO): UserListResponse {
  return {
    users: dto.users.map(mapUserFromDTO),
    pagination: {
      total: dto.total,
      per_page: dto.per_page,
      current_page: dto.current_page,
      last_page: dto.last_page,
    },
  };
}
