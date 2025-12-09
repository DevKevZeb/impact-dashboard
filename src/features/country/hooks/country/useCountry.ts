import { useQuery } from "@tanstack/react-query";
import { fetchSearchCountries, getCountry } from "../../services/country.api";

export function useCountry(id: number){
    return useQuery({
        queryKey: ["country", id],
        queryFn: () => getCountry(id),
        enabled: !!id
    })

}

export function useSearchCountries(search: string, page: number){
    return useQuery({
        queryKey: ["search-countries", search, page],
        queryFn: () => fetchSearchCountries(search, page)
    })
}