import { useQuery } from "@tanstack/react-query";
import { getMeasuresByStrategicOutputId } from "../services/measure.api";

export function useMeasures(id_so: number) {
  return useQuery({
    queryKey: ["measures", id_so],
    queryFn: () => getMeasuresByStrategicOutputId(id_so),
    enabled: !!id_so
  });
}
