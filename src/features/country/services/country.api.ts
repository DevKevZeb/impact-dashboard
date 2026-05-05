import { apiClient } from "@/shared/lib/axios";
import type { Country, CreateCountryDTO, UpdateCountryDTO } from "../types/CountryType";
import { toast } from "sonner";
import { mapCountries, mapCountry } from "../mappers/countries.mapper";


export async function getCountriesPaginated(page: number, perPage: number, search: string){
    const { data } = await apiClient.get(`/countries?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}`);
    return {
        countries: mapCountries(data.data.countries),
        pagination: {
            current_page: data.data.current_page,
            last_page: data.data.last_page,
            per_page: data.data.per_page,
            total: data.data.total
        }
    }
}

export async function getCountry(id: number): Promise<Country>{
    const { data } = await apiClient.get(`/agencies/${id}`);
    return mapCountry(data.data ?? data);
}

export async function createCountry(dto: CreateCountryDTO){
    try{
        const payload = { name: dto.name, currency: { id:dto.currency.id, code: dto.currency.code}};
        const { data } = await apiClient.post("/countries", payload);

        toast.success(data.message);

        return mapCountry(data.data ?? data);
    } catch (error: any) {
    const status = error.response?.status;

    if (status === 422 && error.response?.data?.errors) {
      const errors = error.response.data.errors as Record<string, string[]>;
      Object.values(errors).flat().forEach((msg: string) => {
        toast.error('Error', { description: msg });
      });
    } 

    throw error;
  }
}

export async function updateCountry(id: number, dto: UpdateCountryDTO): Promise<Country>{
  try{
    const payload = {  name: dto.name, currency: { id:dto.currency.id, code: dto.currency.code} }
    const {data} = await apiClient.put(`/countries/${id}`, payload);
    toast.success(data.message);
    return mapCountry(data?.data ?? data);
  }catch (error: any) {
    const status = error.response?.status;

    if (status === 422 && error.response?.data?.errors) {
      const errors = error.response.data.errors as Record<string, string[]>;
      Object.values(errors).flat().forEach((msg: string) => {
        toast.error('Error', { description: msg });
      });
    } 
    throw error;
  }
}

export async function deleteCountry(id: number): Promise<{ success: boolean; message: string; data: unknown[] }> {
  const { data } = await apiClient.delete(`/countries/${id}`);
  return data;
}

export async function fetchSearchCountries(search: string, page: number, limit: number){
  const { data } = await apiClient.get(`/countries?search=${encodeURIComponent(search)}&page=${page}&per_page=${limit}`);
  return {
    countries: mapCountries(data.data.countries),
    pagination: {
      current_page: data.data.current_page,
      last_page: data.data.last_page,
      per_page: data.data.per_page,
      total: data.data.total
    }
  }
}

export async function fetchCountriesForSelect(params: { query: string; page: number; limit: number; }) : Promise<{ items: Country[]; hasMore: boolean}>{
  const { query, page, limit } = params;
  const res = await fetchSearchCountries(query, page, limit);

  return {
    items: res.countries,
    hasMore: res.pagination.current_page < res.pagination.last_page,
  };
}

export async function activateCountry(id: number): Promise<void> {
  const { data } = await apiClient.patch(`/countries/${id}/activate`);
  toast.success(data.message ?? 'Country activated');
}

