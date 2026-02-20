import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/axios";

async function fetchCountryKpas(countryId: number, page: number, perPage: number) {
  try {
    const res = await apiClient.get(`/country_kpas/country/${countryId}?per_page=${perPage}&page=${page}`);
    const kpas = res.data?.data?.kpas;
    const country = res.data?.data?.country;
    if (!Array.isArray(kpas)) return [];

    return {
      country: country,
      kpas: kpas.map((item: any) => ({
        id_kpa: item.id_kpa,
        id_ck: item.id_ck,
        name: item.name,
        implementation: item.implementation,
        strategic_outputs_count: item.strategic_outputs_count,
        measures_count: item.measures_count,
        indicators_count: item.indicators_count,
      })),
      pagination: res.data.data.pagination
    };
  } catch (err: any) {
    if (err.response?.status === 404) {
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
