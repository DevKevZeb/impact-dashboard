import { apiClient } from "@/shared/lib/axios";
import { mapKpa, mapKpas, mapKpasProject } from "../mappers/kpa.mapper";
import type { CreateKpaDto, Kpa, KpaProject, UpdateKpaDto } from "../types/KpaType";
import { toast } from "sonner";

export async function getKpasPaginated(page: number, perPage: number){
    const { data } = await apiClient.get(`/kpas?page=${page}&per_page=${perPage}`);

    return {
        kpas: mapKpas(data.data.kpas),
        pagination: {
          current_page: data.data.current_page,
          last_page: data.data.last_page,
          per_page: data.data.per_page,
          total: data.data.total
        }
    }
}

export async function createKpa(dto: CreateKpaDto): Promise<Kpa>{
    try{
        const payload = { name: dto.name, implementation: dto.implementation };
        const { data } = await apiClient.post("/kpas", payload);

        toast.success(data.message);

        return mapKpa(data.data ?? data)
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

export async function updateKpa(id: number, dto: UpdateKpaDto): Promise<Kpa>{
    try{
        const payload = { name: dto.name, implementation: dto.implementation };
        const { data } = await apiClient.put(`kpas/${id}`, payload);

        toast.success(data.message);

        return mapKpa(data.data ?? data)
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

export async function fetchSearchKpas(search: string, page: number, limit: number){
  const { data } = await apiClient.get(`/kpas?search=${encodeURIComponent(search)}&page=${page}&per_page=${limit}`);
  return {
    kpas: mapKpasProject(data.data.kpas),
    pagination: {
      current_page: data.data.current_page,
      last_page: data.data.last_page,
      per_page: data.data.per_page,
      total: data.data.total
    }
  }
}

export async function fetchKpasForSelect(params: { query: string; page: number; limit: number; }) : Promise<{ items: KpaProject[]; hasMore: boolean}>{
  const { query, page, limit } = params;
  const res = await fetchSearchKpas(query, page, limit);

  return {
    items: res.kpas,
    hasMore: res.pagination.current_page < res.pagination.last_page,
  };
}