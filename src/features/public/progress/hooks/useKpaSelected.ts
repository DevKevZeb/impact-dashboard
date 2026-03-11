import { useQuery } from "@tanstack/react-query";
import { getKpaImplementation } from "../services/progress.api";

export default function useKpaSelected(kpaId?: number) {
  return useQuery({
    queryKey: ["kpa", "implementation", kpaId],
    queryFn: () => getKpaImplementation(kpaId as number),
    enabled: Boolean(kpaId),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 10,
  });
}
