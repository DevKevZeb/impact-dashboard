export interface Role {
  id: number;
  name: string;
}

export interface UserState {
  id: number;
  name: string;
}

export interface RegisteredUser {
  id: number;
  name: string;
  email: string;
  userState: UserState;
  roles: Role[];
  created_at: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role_name: "project-manager" | "country-manager";
}

export interface RegisterResponse {
  user: RegisteredUser;
}

export interface RoleOption {
  value: "project-manager" | "country-manager";
  label: string;
  icon: string;
  description: string;
}

export const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "project-manager",
    label: "Project Manager",
    icon: "🏗️",
    description: "Manages projects, programs, donors, and beneficiaries",
  },
  {
    value: "country-manager",
    label: "Country Manager",
    icon: "🌍",
    description: "Manages KPAs, users, and countries",
  },
];
