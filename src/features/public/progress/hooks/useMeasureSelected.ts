import { useQuery } from "@tanstack/react-query";
import { getMeasureImplementation } from "../services/progress.api";

export default function useMeasureSelected(measureId?: number) {
  return useQuery({
    queryKey: ["measure", "implementation", measureId],
    queryFn: () => getMeasureImplementation(measureId as number),
    enabled: Boolean(measureId),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 10,
  });
}
