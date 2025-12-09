import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/axios";
import type { Kpa } from "@/features/kpa/types/KpaType";

async function fetchCountryKpas(countryId: number): Promise<Kpa[]> {
  try {
    const res = await apiClient.get(`/country-kpas/country/${countryId}`);
    const kpas = res.data?.data?.kpas;

    if (!Array.isArray(kpas)) return [];

    return kpas.map((item: any) => ({
      id: item.id,
      name: item.name,
      implementation: item.implementation,
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
