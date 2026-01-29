export type UserState = "pending" | "active" | "inactive";

export interface UserRole {
  id: number;
  name: string;
}

export interface UserStateInfo {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: UserRole[];
  userState: UserStateInfo;
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
