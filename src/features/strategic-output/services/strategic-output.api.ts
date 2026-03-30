import { apiClient } from "@/shared/lib/axios";
import { mapStrategicOutput, mapStrategicOutputs, mapStrategicOutputsWithCountry } from "../mappers/strategic-output.mapper";
import type { CreateStrategicOutputDTO, StrategicOutput, UpdateStrategicOutputDTO } from "../types/StrategicOutput";
import { toast } from "sonner";

export async function getStrategicOutputsByCountryKpaId(id_ck: number, page: number = 1, perPage: number = 20) {
  const { data } = await apiClient.get(`/strategic-outputs/country-kpa/${id_ck}?page=${page}&per_page=${perPage}`);
  return {
    strategic_outputs: mapStrategicOutputs(data.data.strategic_outputs),
    pagination: {
      current_page: data.data.current_page,
      last_page: data.data.last_page,
      per_page: data.data.per_page,
      total: data.data.total
    }
  };
}


export async function updateStrategicOutput(id: number, dto: UpdateStrategicOutputDTO): Promise<StrategicOutput>{
  try{
    const payload = { name: dto.name, id_ck: dto.country_kpa_id};
    const { data } = await apiClient.put(`/strategic-outputs/${id}`, payload);
    toast.success(data.message);
    return mapStrategicOutput(data?.data ?? data);
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

export async function createStrategicOutput(dto: CreateStrategicOutputDTO){
  try{
    const payload = { name: dto.name, id_ck: dto.country_kpa_id};
    const {data} = await apiClient.post("/strategic-outputs", payload);

    toast.success(data.message);

    return mapStrategicOutput(data?.data ?? data);
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

export async function fetchSearchStrategicOutputByKpaId(search: string, page: number, id: number){
  const { data } = await apiClient.get(`/strategic-outputs/kpa/${id}?search=${encodeURIComponent(search)}&page=${page}&per_page=${5}`);

  return {
    strategic_outputs: mapStrategicOutputsWithCountry(data.data.strategic_outputs),
    pagination: {
      current_page: data.data.current_page,
      last_page: data.data.last_page,
      per_page: data.data.per_page,
      total: data.data.total
    }
  }
}

interface FetchParams {
  query: string;
  page: number;
  limit: number;
}

export function fetchStrategicOutputsForSelect(kpaId: number) {
  return async ({ query, page, limit }: FetchParams) => {
    const { data } = await apiClient.get(`/strategic-outputs/kpa/${kpaId}`, { params: { search: query || undefined, page, per_page: limit}});
  
    return {
      items: mapStrategicOutputsWithCountry(data.data.strategic_outputs),
      hasMore: data.data.current_page < data.data.last_page,
    };
  };
}

export async function deleteStrategicOutput(id: number): Promise<void> {
  await apiClient.delete(`/strategic-outputs/${id}`);
}