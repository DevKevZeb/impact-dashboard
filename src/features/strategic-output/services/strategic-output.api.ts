import { apiClient } from "@/shared/lib/axios";
import { mapStrategicOutput, mapStrategicOutputs } from "../mappers/strategic-output.mapper";
import type { CreateStrategicOutputDTO, StrategicOutput, UpdateStrategicOutputDTO } from "../types/StrategicOutput";
import { toast } from "sonner";

export async function getStrategicOutputsByCountryKpaId(id_ck: number) {
  const { data } = await apiClient.get(`/strategic-outputs/country-kpa/${id_ck}`);
  return mapStrategicOutputs(data.data);
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