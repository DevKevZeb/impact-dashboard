import { useQuery } from "@tanstack/react-query";
import { getProgramWeightAvailability } from "../services/project.api";

export function useProgramWeightAvailability(programId?: number, excludeProjectId?: number) {
  return useQuery({
    queryKey: ["program-weight-availability", programId, excludeProjectId],
    queryFn: () => getProgramWeightAvailability(programId!, excludeProjectId),
    enabled: typeof programId === "number" && programId > 0,
    staleTime: 1000 * 15,
  });
}
