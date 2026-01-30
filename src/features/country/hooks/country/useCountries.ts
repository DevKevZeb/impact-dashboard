import { useQuery } from "@tanstack/react-query";
import { getCountriesPaginated } from "../../services/country.api";

export function useCountries(page: number, perPage: number, search: string) {
    return useQuery({
        queryKey: ["countries", "list", page, perPage, search],
        queryFn: () => getCountriesPaginated(page, perPage, search),
        placeholderData: (prev) => prev,
        staleTime: 1000 * 10,
    });
}