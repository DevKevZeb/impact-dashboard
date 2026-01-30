import { useQuery } from "@tanstack/react-query";
import { getAgenciesPaginated } from "../services/agency.api";

export function useAgencies(page: number, perPage: number, search: string) {
  return useQuery({
    queryKey: ["agencies", page, perPage, search],
    queryFn: () =>  getAgenciesPaginated(page, perPage, search),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 10,
  });
}
