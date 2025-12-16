import { apiClient } from "@/shared/lib/axios";
import { mapMeasure, mapMeasures } from "../mappers/measure.mapper";
import type { CreateMeasureDTO, Measure, UpdateMeasureDTO } from "../types/measureTypes";
import { toast } from "sonner";

export async function getMeasuresByStrategicOutputId(id_so: number) {
  const { data } = await apiClient.get(`/measures/strategic-output/${id_so}`);
  return mapMeasures(data.data);
}

export async function updateMeasure(id: number, dto: UpdateMeasureDTO): Promise<Measure>{
  try{
    const payload = { name: dto.name, strategic_output_id: dto.strategic_output_id };
    const { data } = await apiClient.put(`/measures/${id}`, payload);

    toast.success(data.message);

    return mapMeasure(data?.data ?? data);

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

export async function createMeasure(dto: CreateMeasureDTO): Promise<Measure>{
  try{
      const payload = { name: dto.name, strategic_output_id: dto.strategic_output_id};
      const {data} = await apiClient.post("/measures", payload);
  
      toast.success(data.message);
  
      return mapMeasure(data?.data ?? data);
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