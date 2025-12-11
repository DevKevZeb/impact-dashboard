import { apiClient } from "@/shared/lib/axios";
import { mapIndicators } from "../mappers/indicator.mapper";

export async function getIndicatorsByMeasureId(id_measure: number) {
  const { data } = await apiClient.get(`/measures-indicators/${id_measure}`);
  return mapIndicators(data.data.indicators);
}
