export interface Currency {
  id: number;
  code: string;
  name: string;
}

export interface Country {
  id: number;
  name: string;
  active: number;
  currency?: Currency;
  kpas_count?: number;
  strategic_outputs_count?: number;
  measures_count?: number;
  indicators_count?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface UserRole {
  id: number;
  user?: User;
  role?: Role;
  country?: Country;
}

export interface JoinRequest {
  id: number;
  country_id: number;
  country?: Country;
  requester_user_role_id: number;
  requester_user_role?: {
    user?: User;
    role?: Role;
  };
  status: "pending" | "approved" | "rejected" | "revoked";
  created_at: string;
  updated_at: string;
}

export type ReviewAction = "approve" | "revoke";

export interface ReviewDecisionRequest {
  action: ReviewAction;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ListResponse<T> {
  data: T[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface CountriesListResponse {
  countries: Country[];
  total?: number;
}

export interface JoinRequestsListResponse {
  requests: JoinRequest[];
  total?: number;
}
