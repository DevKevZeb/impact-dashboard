import { useQuery } from "@tanstack/react-query";
import { getCountriesPaginated } from "../../services/country.api";

export function useCountries(page: number, perPage: number) {
    return useQuery({
        queryKey: ["countries", page, perPage],
        queryFn: () => getCountriesPaginated(page, perPage)
    });
}