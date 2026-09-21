import type { AxiosError } from "axios";
import { apiClient } from "@/shared/lib/axios";
import { mapBeneficiaries, mapBeneficiary } from "../mappers/beneficiaries.mapper";
import type { Beneficiary, BeneficiaryDTO } from "../types/beneficiaries.types";
import { toast } from "sonner";

export async function getBeneficiariesPaginated(page: number, perPage: number, search: string): Promise<{ beneficiaries: Beneficiary[]; pagination: { current_page: number; last_page: number; per_page: number; total: number; }; }> {

  const { data } = await apiClient.get(`/beneficiaries?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}`);

  return {
    beneficiaries: mapBeneficiaries(data.data.beneficiaries),
    pagination: {
      current_page: data.data.current_page,
      last_page: data.data.last_page,
      per_page: data.data.per_page,
      total: data.data.total
    }
  };
}

export async function createBeneficiary(dto: BeneficiaryDTO): Promise<Beneficiary> {
  try{
    const payload = { name: dto.name}
    const { data } = await apiClient.post("/beneficiaries", payload);
    toast.success(data.message)

    // NOTE: pre-existing bug (predates this cleanup) - wraps the raw object in
    // an array before passing to the singular `mapBeneficiary`, which reads
    // `.id`/`.name` directly and so gets `undefined` for both at runtime. Left
    // as-is (cast only) since this pass is type-annotations only, not a
    // behavior fix - see PR/commit notes.
    return mapBeneficiary([data.data ?? data] as unknown as Record<string, unknown>);
  } catch(error: unknown) {
    showErrors(error);
    throw error;
  }
}

export async function updateBeneficiary(id: number, dto: BeneficiaryDTO): Promise<Beneficiary>{
  try{
    const payload = { name: dto.name};
    const {data} = await apiClient.put(`/beneficiaries/${id}`, payload);
    toast.success(data.message);
    return mapBeneficiary(data.data ?? data);
  }catch (error: unknown) {
    showErrors(error);
    throw error;
  }
}

export async function deleteBeneficiary(id: number): Promise<{ success: boolean; message: string; data: unknown[] }> {
  const { data } = await apiClient.delete(`/beneficiaries/${id}`);
  return data;
}


function showErrors(error: unknown){
    const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
    const status = axiosError.response?.status;

    if (status === 422 && axiosError.response?.data?.errors) {
      const errors = axiosError.response.data.errors;
      Object.values(errors).flat().forEach((msg: string) => {
        toast.error('Error', { description: msg });
      });
    }
}

export async function fetchSearchBeneficiaries(search: string, page: number, limit: number){
  const { data } = await apiClient.get(`/beneficiaries?search=${encodeURIComponent(search)}&page=${page}&per_page=${limit}`);
  return {
    beneficiaries: mapBeneficiaries(data.data.beneficiaries),
    pagination: {
      current_page: data.data.current_page,
      last_page: data.data.last_page,
      per_page: data.data.per_page,
      total: data.data.total
    }
  }
}



export async function fetchBeneficiariesForSelector(params: { query: string; page: number; limit: number; }){
  const { query, page, limit } = params;
  const data = await fetchSearchBeneficiaries(query, page, limit);

  return {
    items: mapBeneficiaries(data.beneficiaries),
    hasMore: data.pagination.current_page < data.pagination.last_page
  }

}
