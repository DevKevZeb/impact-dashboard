import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, getCurrentUser, refreshToken } from "./auth.api";
import type { LoginInput } from "../types/auth.types";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: LoginInput) => login(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.access_token);
      navigate("/");
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
}

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

export function useRefreshToken() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: refreshToken,
    onSuccess: (data) => {
      if (user) {
        setAuth(user, data.access_token);
      }
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}
