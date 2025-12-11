import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/axios";

async function fetchCountryKpas(countryId: number) {
  try {
    const res = await apiClient.get(`/country-kpas/country/${countryId}`);
    const kpas = res.data?.data?.kpas;

    if (!Array.isArray(kpas)) return [];

    return kpas.map((item: any) => ({
      id_kpa: item.id_kpa,
      id_ck: item.id_ck,
      name: item.name,
      implementation: item.implementation,
      strategic_outputs_count: item.strategic_outputs_count

    }));
  } catch (err: any) {
    if (err.response?.status === 404) {
      return [];
    }
    throw err;
  }
}


export function useCountryKpas(countryId: number, enabled: boolean) {
  return useQuery({
    queryKey: ["country-kpas", countryId],
    queryFn: () => fetchCountryKpas(countryId),
    enabled,
    staleTime: 0,
  });
}
