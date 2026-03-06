import { useQuery } from "@tanstack/react-query";
import { getPublicCountries } from "../../services/publicCountry.api";

export const publicCountryKeys = {
  all: ["publicCountries"] as const,
  list: () => [...publicCountryKeys.all, "list"] as const,
};

/**
 * Hook to fetch countries for registration form (no authentication required)
 * @returns TanStack Query result with countries list
 */
export function usePublicCountries() {
  return useQuery({
    queryKey: publicCountryKeys.list(),
    queryFn: () => getPublicCountries(100), // Fetch all countries
    staleTime: 10 * 60 * 1000, // 10 minutes - countries don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes cache
  });
}
