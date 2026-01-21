import { apiClient, type ApiResponse } from "@/shared/lib/axios";
import type { LoginInput, AuthResponse, RefreshTokenResponse, User } from "../types/auth.types";
import { toast } from "sonner";
import { AxiosError } from "axios";

const AUTH_ENDPOINT = "/auth";

export async function login(credentials: LoginInput): Promise<AuthResponse> {
  try {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      `${AUTH_ENDPOINT}/login`,
      credentials
    );

    if (data.success) {
      toast.success("Welcome back", {
        description: "You have successfully logged in",
      });
      return data.data;
    }

    throw new Error(data.message);
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const status = axiosError.response?.status;

    if (status === 400 || status === 422) {
      const message = axiosError.response?.data?.message || "Invalid credentials";
      toast.error("Authentication error", {
        description: message,
      });
    } else if (status === 500) {
      toast.error("Server error", {
        description: "Please try again later",
      });
    } else {
      toast.error("Connection error", {
        description: "Please check your internet connection",
      });
    }

    throw error;
  }
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<{ user: User }>>(
    `${AUTH_ENDPOINT}/me`
  );
  return data.data.user;
}

export async function refreshToken(): Promise<RefreshTokenResponse> {
  const { data } = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
    `${AUTH_ENDPOINT}/refresh`
  );
  return data.data;
}
