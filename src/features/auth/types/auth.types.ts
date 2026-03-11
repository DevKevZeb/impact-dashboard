export interface Role {
  id: number;
  name: string;
}

export interface CountryUserRole {
  id: number;
  country: { id: number; name: string };
}

export interface User {
  id: number;
  name: string;
  email: string;
  user_state_id: number;
  roles: Role[];
  country_user_role: CountryUserRole | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}
