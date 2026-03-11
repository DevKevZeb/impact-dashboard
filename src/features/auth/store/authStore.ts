import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/auth.types";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  scopes: string[];
  hasCountryScope: boolean;
  countryUserRoleId: number;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  hasScope: (scope: string) => boolean;
  hasAnyScope: (scopes: string[]) => boolean;
  hasAllScopes: (scopes: string[]) => boolean;
}

function extractScopesFromToken(token: string): string[] {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.scopes || payload.permissions || [];
  } catch (error) {
    console.error("Error extracting scopes from token:", error);
    return [];
  }
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      scopes: [],
      hasCountryScope: false,
      countryUserRoleId: 0,

      setAuth: (user, token) => {
        localStorage.setItem("auth_token", token);
        const scopes = extractScopesFromToken(token);
        set({
          user,
          token,
          isAuthenticated: true,
          scopes,
          hasCountryScope: !!user.country_user_role,
          countryUserRoleId: user.country_user_role?.id ?? 0,
        });
      },

      setUser: (user) => {
        set({
          user,
          hasCountryScope: !!user.country_user_role,
          countryUserRoleId: user.country_user_role?.id ?? 0,
        });
      },

      logout: () => {
        localStorage.removeItem("auth-storage");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("filters-storage");
        localStorage.removeItem("ui-storage");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          scopes: [],
          hasCountryScope: false,
          countryUserRoleId: 0,
        });

      },

      hasScope: (scope) => {
        const { scopes } = get();
        
        if (scopes.includes("*:*")) return true;
        if (scopes.includes(scope)) return true;
        
        const [module] = scope.split(":");
        if (scopes.includes(`${module}:*`)) return true;
        
        return false;
      },

      hasAnyScope: (requiredScopes) => {
        const { hasScope } = get();
        return requiredScopes.some((scope) => hasScope(scope));
      },

      hasAllScopes: (requiredScopes) => {
        const { hasScope } = get();
        return requiredScopes.every((scope) => hasScope(scope));
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        scopes: state.scopes,
        hasCountryScope: state.hasCountryScope,
        countryUserRoleId: state.countryUserRoleId,
      }),
    }
  )
);
