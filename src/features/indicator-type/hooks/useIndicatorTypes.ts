import { useQuery } from "@tanstack/react-query";
import { fetchSearchIndicatorTypes, getIndicatorTypesPaginated } from "../services/indicatortype.api";

export function useIndicatorTypes(page: number, perPage: number, search: string){
    return useQuery({
        queryKey: ["types", page, perPage, search],
        queryFn: () => getIndicatorTypesPaginated(page, perPage, search),
        placeholderData: (prev) => prev,
        staleTime: 1000 * 10,
    });
}


export function useSearchIndicatorTypes(search: string, page: number){
    return useQuery({
        queryKey: ["search-types", search, page],
        queryFn: () => fetchSearchIndicatorTypes(search, page),
    })
}