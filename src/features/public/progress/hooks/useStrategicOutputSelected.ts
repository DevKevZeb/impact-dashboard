import { useQuery } from "@tanstack/react-query";
import { getStrategicOutputImplementation } from "../services/progress.api";

export default function useStrategicOutputSelected(strategicOutputId?: number) {
  return useQuery({
    queryKey: ["strategic-output", "implementation", strategicOutputId],
    queryFn: () => getStrategicOutputImplementation(strategicOutputId as number),
    enabled: Boolean(strategicOutputId),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 10,
  });
}
