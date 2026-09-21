import type { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/axios";

async function fetchCountryKpas(countryId: number, page: number, perPage: number) {
  try {
    const res = await apiClient.get(`/country_kpas/country/${countryId}?per_page=${perPage}&page=${page}`);
    const kpas = res.data?.data?.kpas;
    const country = res.data?.data?.country;
    if (!Array.isArray(kpas)) return [];

    return {
      country: country ? { ...country, active: country.active ?? false } : country,
      kpas: kpas.map((item: Record<string, unknown>) => ({
        id_kpa: item.id_kpa as number,
        id_ck: item.id_ck as number,
        name: item.name as string,
        implementation: item.implementation as number,
        strategic_outputs_count: item.strategic_outputs_count as number,
        measures_count: item.measures_count as number,
        indicators_count: item.indicators_count as number,
      })),
      pagination: res.data.data.pagination
    };
  } catch (err: unknown) {
    const axiosError = err as AxiosError;
    if (axiosError.response?.status === 404) {
      return [];
    }
    throw err;
  }
}


export function useCountryKpas(countryId: number, page: number, perPage: number,  enabled: boolean) {
  return useQuery({
    queryKey: ["country_kpas", countryId, page, perPage],
    queryFn: () => fetchCountryKpas(countryId, page, perPage),
    enabled,
    staleTime: 0,
  });
}
