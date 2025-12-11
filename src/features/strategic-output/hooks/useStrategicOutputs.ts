import { useQuery } from "@tanstack/react-query";
import { getStrategicOutputsByCountryKpaId } from "../services/strategic-output.api";

export function useStrategicOutputs(id_ck: number) {
  return useQuery({
    queryKey: ["strategic-outputs", id_ck],
    queryFn: () => getStrategicOutputsByCountryKpaId(id_ck),
    enabled: !!id_ck
  });
}
