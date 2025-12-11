import { apiClient } from "@/shared/lib/axios";
import { mapMeasures } from "../mappers/measure.mapper";

export async function getMeasuresByStrategicOutputId(id_so: number) {
  const { data } = await apiClient.get(`/measures/strategic-output/${id_so}`);
  return mapMeasures(data.data);
}
