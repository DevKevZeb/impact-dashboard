import { apiClient } from "@/shared/lib/axios";
import { mapDonor, mapDonors } from "../mappers/donor.mapper";
import type { Donor, DonorDTO } from "../types/donor.types";
import { toast } from "sonner";

export async function getDonorsPaginated(page: number, perPage: number, search: string): Promise<{ donors: Donor[]; pagination: { current_page: number; last_page: number; per_page: number; total: number } }> {
    const { data } = await apiClient.get(`/donors?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}`);
    return {
        donors: mapDonors(data.data.donors),
        pagination: {
          current_page: data.data.current_page,
          last_page: data.data.last_page,
          per_page: data.data.per_page,
          total: data.data.total
        }
    };
}

export async function createDonor(dto: DonorDTO): Promise<Donor>{
    try{
        const payload = { name: dto.name };
        const { data } = await apiClient.post("/donors", payload);
        toast.success(data.message);

        return mapDonor(data.data ?? data);
    } catch(error: any) {
        showErrors(error);
        throw error;
    } 
}

export async function updateDonor(id: number, dto: DonorDTO): Promise<Donor>{
    try{
        const payload = { name: dto.name };
        const {data} = await apiClient.put(`/donors/${id}`, payload);
        toast.success(data.message);

        return mapDonor(data.data ?? data);
    } catch (error: any) {
        showErrors(error);
        throw error;
    }
}

export async function deleteDonor(id: number): Promise<{ success: boolean; message: string; data: unknown[] }> {
    const { data } = await apiClient.delete(`/donors/${id}`);
    return data;
}

interface FetchParams {
  query: string;
  page: number;
  limit: number;
}

export function fetchDonorsForSelect(excludedIds: number[] = []){
  return async ({query, page, limit } : FetchParams)=>{
    const { data } = await apiClient.get(`/donors/get/project`, { params: {search: query || undefined, page, per_page:limit, exclude: excludedIds.length ? excludedIds : undefined}})

    return {
      items: mapDonors(data.data.donors),
      hasMore: data.data.current_page < data.data.last_page,
      total: data.data.all
    };
  }
}

function showErrors(error: any) {
    const status = error.response?.status;

    if (status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors as Record<string, string[]>;
        Object.values(errors).flat().forEach((msg: string) => {
          toast.error('Error', { description: msg });
        });
    }
}