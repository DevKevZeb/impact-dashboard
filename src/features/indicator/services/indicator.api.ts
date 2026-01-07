import { apiClient } from "@/shared/lib/axios";
import { mapIndicators, mapIndicator } from "../mappers/indicator.mapper";
import type { CreateIndicatorDTO, Indicator, UpdateIndicatorDTO } from "../types/indicatorTypes";
import { toast } from "sonner";

export async function getIndicatorsByMeasureId(id_measure: number) {
  const { data } = await apiClient.get(`/measures-indicators/${id_measure}`);
  return mapIndicators(data.data.indicators);
}


export async function createIndicator(dto: CreateIndicatorDTO): Promise<Indicator>{
  try{
    const payload = { name: dto.name, target: dto.target, type_id: dto.type_id, measure_id: dto.measure_id };
    const { data } = await apiClient.post("/indicators", payload);

    toast.success(data.message);

    return mapIndicator(data?.data ?? data);
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

export async function updateIndicator(id: number, dto: UpdateIndicatorDTO): Promise<Indicator>{
  try{
    const payload = { name: dto.name, target: dto.target, type_id: dto.type_id, measure_id: dto.measure_id};
    const { data } = await apiClient.put(`/indicators/${id}`, payload);

    toast.success(data.message);

    return mapIndicator(data?.data ?? data);
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

interface FetchParams {
  query: string;
  page: number;
  limit: number;
}

export function fetchIndicatorForSelect(measureId: number, excludedIds: number[] = []){
  return async ({query, page, limit } : FetchParams)=>{
    const { data } = await apiClient.get(`/indicators/measure/${measureId}`, { params: {search: query || undefined, page, per_page:limit, exclude: excludedIds.length ? excludedIds : undefined}})

    return {
      items: mapIndicators(data.data.indicators),
      hasMore: data.data.current_page < data.data.last_page,
    };

  }
}