import { useQuery } from "@tanstack/react-query";
import { getIndicatorsByMeasureId } from "../services/indicator.api";

export function useIndicators(id_measure: number) {
  return useQuery({
    queryKey: ["indicators", id_measure],
    queryFn: () => getIndicatorsByMeasureId(id_measure),
    enabled: !!id_measure
  });
}
