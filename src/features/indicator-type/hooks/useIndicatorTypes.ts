import { useQuery } from "@tanstack/react-query";
import { fetchSearchIndicatorTypes, getIndicatorTypesPaginated } from "../services/indicatortype.api";

export function useIndicatorTypes(page: number, perPage: number) {
    return useQuery({
        queryKey: ["types", page, perPage],
        queryFn: () => getIndicatorTypesPaginated(page, perPage)
    });
}


export function useSearchIndicatorTypes(search: string, page: number){
    return useQuery({
        queryKey: ["search-types", search, page],
        queryFn: () => fetchSearchIndicatorTypes(search, page),
    })
}