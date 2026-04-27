import { useQuery } from "@tanstack/react-query";
import { countryDashboardShareService } from "../../country-dashboard-share/api/countryDashboardShare.service";

export function useSharedCountriesForAdmin(page: number = 1, perPage: number = 10, search: string = "") {
  return useQuery({
    queryKey: ["shared-countries", page, perPage, search],
    queryFn: async () => {
      const response = await countryDashboardShareService.getVisibleForAdmin(page, perPage);

      // Filter by search term locally if provided
      let shares = response.shares ?? [];
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        shares = shares.filter((share) =>
          share.country?.name?.toLowerCase().includes(searchLower)
        );
      }

      // Extract unique countries from shares and transform to country list format
      const seenCountryIds = new Set<number>();
      const countries = shares
        .filter((share) => {
          if (!share.country?.id || seenCountryIds.has(share.country.id)) return false;
          seenCountryIds.add(share.country.id);
          return true;
        })
        .map((share) => ({
          id: share.country!.id,
          name: share.country!.name,
          currency: {
            id: 1,
            code: "USD",
          },
          kpas_count: 0,
        }));

      return {
        countries,
        pagination: {
          current_page: response.current_page ?? 1,
          last_page: response.last_page ?? 1,
          per_page: response.per_page ?? 10,
          total: response.total ?? 0,
        },
      };
    },
    placeholderData: (prev) => prev,
    staleTime: 1000 * 10,
  });
}
