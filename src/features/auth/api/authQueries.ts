import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { login, getCurrentUser, refreshToken } from "./auth.api";
import type { LoginInput, User } from "../types/auth.types";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

// Mirrors the role → landing page mapping in DashboardPage's redirect effect.
function resolvePostLoginRoute(user: User): string {
  const roleNames = user.roles.map((role) => role.name);
  if (roleNames.includes("admin")) return "/app/admin-dashboard";
  if (roleNames.includes("country-manager")) return "/app/country-kpa";
  return "/app/dashboard";
}

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (credentials: LoginInput) => login(credentials),
    onSuccess: async (data) => {
      setAuth(data.user, data.access_token);
      // Navigate immediately using the roles already on the login response,
      // rather than after the getCurrentUser() await below - waiting let this
      // race against PublicRoute's own authenticated-redirect and could land
      // back on "/" after already having reached the right dashboard.
      navigate(resolvePostLoginRoute(data.user), { replace: true });
      // Fetch full profile in the background to get country_user_role and populate countryUserRoleId
      try {
        const fullUser = await getCurrentUser();
        setUser(fullUser);
      } catch {
        // Login still succeeds even if /auth/me fails
      }
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
    staleTime: 15 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 15 * 1000,
    retry: false,
  });
}

export function useSyncCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);
  const { data } = useCurrentUser();

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);
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
