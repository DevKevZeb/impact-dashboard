import { useQuery } from "@tanstack/react-query";
import { getAgenciesPaginated } from "../services/agency.api";

export function useAgencies(page: number, perPage: number) {
  return useQuery({
    queryKey: ["agencies", page, perPage],
    queryFn: () =>  getAgenciesPaginated(page, perPage)
  });
}
