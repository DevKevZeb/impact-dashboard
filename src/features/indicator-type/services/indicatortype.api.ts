import type { AxiosError } from "axios";
import { apiClient } from "@/shared/lib/axios";
import { mapIndicatorType, mapIndicatorTypes } from "../mappers/indicatortype.mapper";
import type { IndicatorType, IndicatorTypeDTO } from "../types/IndicatorTypeType";
import { toast } from "sonner";

export async function getIndicatorTypesPaginated(page: number, perPage: number, search: string): Promise<{ types: IndicatorType[]; pagination: { current_page: number; last_page: number; per_page: number; total: number; } }> {
    const { data } = await apiClient.get(`/indicator-types?page=${page}&per_page=${perPage}&search=${search}`);

    return {
        types: mapIndicatorTypes(data.data.indicator_types),
        pagination: {
          current_page: data.data.current_page,
          last_page: data.data.last_page,
          per_page: data.data.per_page,
          total: data.data.total
        }
    }
}

export async function createIndicatorType(dto: IndicatorTypeDTO): Promise<IndicatorType>{
    try{
        const payload = { name: dto.name, is_bottom_up: dto.is_bottom_up };
        const { data } = await apiClient.post("/indicator-types", payload);

        toast.success(data.message);
        return mapIndicatorType(data.data ?? data);
    } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
        const status = axiosError.response?.status;

        if (status === 422 && axiosError.response?.data?.errors) {
        const errors = axiosError.response.data.errors;
        Object.values(errors).flat().forEach((msg: string) => {
            toast.error('Error', { description: msg });
        });
        }

        throw error;
    }
}

export async function updateIndicatorType(id: number, dto: IndicatorTypeDTO): Promise<IndicatorType>{
    try{
        const payload = { name: dto.name, is_bottom_up: dto.is_bottom_up };
        const { data } = await apiClient.put(`/indicator-types/${id}`, payload);

        toast.success(data.message);

        return mapIndicatorType(data.data ?? data);
    } catch (error: unknown) {
        const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
        const status = axiosError.response?.status;

        if (status === 422 && axiosError.response?.data?.errors) {
        const errors = axiosError.response.data.errors;
        Object.values(errors).flat().forEach((msg: string) => {
            toast.error('Error', { description: msg });
        });
        }

        throw error;
    }
}

export async function fetchSearchIndicatorTypes(search:string, page: number){
    const { data } = await apiClient.get(`/indicator-types?search=${search}&page=${page}&per_page=${20}`);

    return {
        types: mapIndicatorTypes(data.data.indicator_types),
        pagination: {
          current_page: data.data.current_page,
          last_page: data.data.last_page,
          per_page: data.data.per_page,
          total: data.data.total
        }
    }
}

export async function fetchIndicatorTypesForSelect(params: { query: string; page: number; limit: number; }) : Promise<{ items: IndicatorType[]; hasMore: boolean}>{
  const { query, page } = params;
  const res = await fetchSearchIndicatorTypes(query, page);

  return {
    items: res.types,
    hasMore: res.pagination.current_page < res.pagination.last_page,
  };
}

export async function deleteIndicatorType(id: number): Promise<void> {
  await apiClient.delete(`/indicator-types/${id}`);
}
