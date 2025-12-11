import { apiClient } from "@/shared/lib/axios";
import { mapStrategicOutputs } from "../mappers/strategic-output.mapper";

export async function getStrategicOutputsByCountryKpaId(id_ck: number) {
  const { data } = await apiClient.get(`/strategic-outputs/country-kpa/${id_ck}`);
  return mapStrategicOutputs(data.data);
}
