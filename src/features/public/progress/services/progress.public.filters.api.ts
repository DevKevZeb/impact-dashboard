import { publicApiClient } from "@/shared/lib/axios.public";
import type { Country } from "../../projects/types/country.type";

export async function fetchCountriesForPublicProgress(params: {
  query: string;
  page: number;
  limit: number;
}): Promise<{ items: Country[]; hasMore: boolean }> {
  const { query, page, limit } = params;
  
  try {
    const { data } = await publicApiClient.get<any>("/countries", {
      params: {
        search: query || "",
        page,
        per_page: limit,
      },
    });

    const countries = (data.data?.countries || []).map((country: any) => ({
      id: country.id,
      name: country.name,
    }));
    const pagination = data.data || { current_page: 1, last_page: 1 };

    return {
      items: countries,
      hasMore: pagination.current_page < pagination.last_page,
    };
  } catch (error) {
    console.error("Error fetching countries:", error);
    return { items: [], hasMore: false };
  }
}

export function fetchKPAsForCountry(countryId: number) {
  return async (params?: { query?: string; page?: number; limit?: number }) => {
    try {
      const { data } = await publicApiClient.get<any>(`/kpas/${countryId}`, {
        params: {
          search: params?.query || "",
          page: params?.page || 1,
          per_page: params?.limit || 100,
        },
      });
      
      const kpas = (data.data?.kpas || []).map((kpa: any) => ({
        id: kpa.id || kpa.id_ck,
        name: kpa.name,
      }));

      const pagination = data.data || { current_page: 1, last_page: 1 };

      return {
        items: kpas,
        hasMore: pagination.current_page < pagination.last_page,
      };
    } catch (error) {
      console.error(`Error fetching KPAs for country ${countryId}:`, error);
      return { items: [], hasMore: false };
    }
  };
}
