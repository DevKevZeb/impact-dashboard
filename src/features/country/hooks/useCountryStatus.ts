import { useAuthStore } from "@/features/auth/store/authStore";
import type { CountryUserRole } from "@/features/auth/types/auth.types";

export interface CountryStatus {
  hasCountry: boolean;
  isActive: boolean;
  isCountryManager: boolean;
  isProjectManager: boolean;
  isAdmin: boolean;
  countryId: number | null;
  countryName: string | null;
}

export function useCountryStatus(): CountryStatus {
  const user = useAuthStore((s) => s.user);

  const roleNames = (user?.roles ?? []).map((r) => r.name);
  const isAdmin = roleNames.includes("admin");
  const isCountryManager = roleNames.includes("country-manager");
  const isProjectManager = roleNames.includes("project-manager");

  const countryRoles: CountryUserRole[] = user?.country_user_roles?.length
    ? user.country_user_roles
    : user?.country_user_role
      ? [user.country_user_role]
      : [];

  const hasCountry = countryRoles.length > 0;

  const isActive = hasCountry ? countryRoles.every((cur) => cur.country?.active) : true;

  const inactive = countryRoles.find((cur) => !cur.country?.active);
  const relevant = inactive ?? countryRoles[0];

  return {
    hasCountry,
    isActive,
    isCountryManager,
    isProjectManager,
    isAdmin,
    countryId: relevant?.country?.id ?? null,
    countryName: relevant?.country?.name ?? null,
  };
}
