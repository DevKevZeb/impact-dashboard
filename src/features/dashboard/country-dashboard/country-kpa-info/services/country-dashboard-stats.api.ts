import { apiClient } from "@/shared/lib/axios";
import type { CountryDashboardImplementationResponse } from "../types/kpas.type";

export async function fetchCountryDashboardImplementation(countryId: number, page: number, perPage: number): Promise<CountryDashboardImplementationResponse> {
  const { data } = await apiClient.get(`/country_kpas/country/${countryId}/implementation`, {
    params: {
      page,
      per_page: perPage,
    },
  });

  return data?.data as CountryDashboardImplementationResponse;
}