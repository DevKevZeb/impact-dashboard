import { useQuery } from "@tanstack/react-query";
import { fetchSearchCountries, getCountry } from "../../services/country.api";

export function useCountry(id: number){
    return useQuery({
        queryKey: ["countries", "detail", id],
        queryFn: () => getCountry(id),
        enabled: !!id
    })

}

export function useSearchCountries(search: string, page: number, limit: number){
    return useQuery({
        queryKey: ["countries", "search", search, page, limit],
        queryFn: () => fetchSearchCountries(search, page, limit)
    })
}