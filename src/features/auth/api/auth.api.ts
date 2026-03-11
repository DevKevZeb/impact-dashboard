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
    const message = axiosError.response?.data?.message;

    if (status === 401) {
      // Invalid credentials or account issues
      toast.error("Authentication failed", {
        description: message || "Invalid email or password",
      });
    } else if (status === 403) {
      // Email not verified or account pending/inactive
      // Don't show toast - let component handle the specific message
      throw error;
    } else if (status === 400 || status === 422) {
      toast.error("Authentication error", {
        description: message || "Invalid credentials",
      });
    } else if (status === 500) {
      toast.error("Server error", {
        description: "Please try again later",
      });
    } else if (!status) {
      // Network error - no response from server
      toast.error("Connection error", {
        description: "Unable to connect to the server. Please check your internet connection.",
      });
    } else {
      toast.error("Error", {
        description: message || "An unexpected error occurred",
      });
    }

    throw error;
  }
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<User>>(
    `${AUTH_ENDPOINT}/me`
  );
  return data.data;
}

export async function refreshToken(): Promise<RefreshTokenResponse> {
  const { data } = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
    `${AUTH_ENDPOINT}/refresh`
  );
  return data.data;
}
