import { useQuery } from "@tanstack/react-query";
import { getAgency } from "../services/agency.api";

export function useAgency(id: number) {
  return useQuery({
    queryKey: ["agency", id],
    queryFn: () => getAgency(id),
    enabled: !!id,
  });
}
