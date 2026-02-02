import { apiClient } from "@/shared/lib/axios";
import type { Agency, CreateAgencyDto, UpdateAgencyDto } from "../types/agency.types";
import { mapAgencies, mapAgency } from "../mappers/agency.mapper";
import { toast } from "sonner";

export async function getAgencies(): Promise<Agency[]> {
  const { data } = await apiClient.get("/agencies");
  return mapAgencies(data.data.agencies ?? data);
}

export async function getAgenciesPaginated(page: number, perPage: number, search: string) {
  const { data } = await apiClient.get(`/agencies?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}`);
  return {
    agencies: mapAgencies(data.data.agencies),
    pagination: {
      current_page: data.data.current_page,
      last_page: data.data.last_page,
      per_page: data.data.per_page,
      total: data.data.total
    }
  };
}

export async function getAgency(id: number): Promise<Agency> {
  const { data } = await apiClient.get(`/agencies/${id}`);
  return mapAgency(data.data ?? data);
}

export async function createAgency(dto: CreateAgencyDto): Promise<Agency> {
  try{
    const payload = { name: dto.name, url: dto.url, is_approved: dto.isApproved, };
    const { data } = await apiClient.post("/agencies", payload);

    toast.success(data.message);

    return mapAgency(data.data ?? data);
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

export async function updateAgency( id: number, dto: UpdateAgencyDto): Promise<Agency> {
  try{
    const payload = {
      name: dto.name,
      url: dto.url,
      is_approved: dto.isApproved,
    };
    const { data } = await apiClient.put(`/agencies/${id}`, payload);
    toast.success(data.message);
    
    return mapAgency(data.data ?? data);
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

export function fetchAgenciesForSelector(excludedIds: number[] = []){
  return async ({ query, page, limit} : FetchParams) =>{

    const { data } = await apiClient.get(`/agencies/get/project`, { params: { search: query || undefined, page, per_page: limit, exclude: excludedIds.length? excludedIds:undefined}});

    return {
      items: mapAgencies(data.data.agencies),
      hasMore: data.data.current_page < data.data.last_page,
      total: data.data.all
    };
  }
}


/*
export async function deleteAgency(id: number): Promise<void> {
  await apiClient.delete(`/agencies/${id}`);
}*/