import { useQuery } from "@tanstack/react-query";
import { getStatisticsOverview } from "../services/statistics.api";

export function useStatisticsOverview() {
  return useQuery({
    queryKey: ["statistics", "overview"],
    queryFn: getStatisticsOverview,
    staleTime: 1000 * 60,
  });
}
