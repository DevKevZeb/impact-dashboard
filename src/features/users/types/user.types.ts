// UserState es dinámico - acepta cualquier estado del backend
export type UserState = string;

export interface UserRole {
  id: number;
  name: string;
}

export interface UserStateInfo {
  id: number;
  name: string;
}

export interface Country {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: UserRole[];
  userState: UserStateInfo;
  countries: Country[]; // Backend envía array de países
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface UserListResponse {
  users: User[];
  pagination: Pagination;
}

export interface UpdateUserStateInput {
  userStateId: number;
}
