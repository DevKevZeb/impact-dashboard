import { useAuthStore } from "../store/authStore";

export function useHasScope(scope: string): boolean {
  return useAuthStore((state) => state.hasScope(scope));
}

export function useHasAnyScope(scopes: string[]): boolean {
  return useAuthStore((state) => state.hasAnyScope(scopes));
}

export function useHasAllScopes(scopes: string[]): boolean {
  return useAuthStore((state) => state.hasAllScopes(scopes));
}
