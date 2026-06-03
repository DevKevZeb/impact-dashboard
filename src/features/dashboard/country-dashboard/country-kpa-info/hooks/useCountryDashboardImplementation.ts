import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchCountryDashboardImplementation } from "../services/country-dashboard-stats.api";

export function useCountryDashboardImplementation(countryId: number, page: number, perPage: number, enabled: boolean) {
  return useQuery({
    queryKey: ["country_dashboard_implementation", countryId, page, perPage],
    queryFn: () => fetchCountryDashboardImplementation(countryId, page, perPage),
    placeholderData: keepPreviousData,
    enabled,
  });
}