import { useAuthStore } from "@/features/auth/store/authStore";

export const countryJoinRequestKeys = {
  all: ["country-join-requests"] as const,
  activeCountries: (contextKey: string) =>
    [...countryJoinRequestKeys.all, "active-countries", contextKey] as const,
  list: (contextKey: string) =>
    [...countryJoinRequestKeys.all, "list", contextKey] as const,
};

export function useCountryJoinRequestContextKey(): string {
  const user = useAuthStore((state) => state.user);

  return user
    ? `${user.id}:${user.country_user_role?.id ?? 0}`
    : "anonymous";
}