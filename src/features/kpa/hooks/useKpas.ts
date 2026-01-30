import { useQuery } from "@tanstack/react-query";
import { fetchSearchKpas, getKpasPaginated } from "../services/kpa.api";

export function useKpas(page: number, perPage: number, search: string){
    return useQuery({
        queryKey: ["kpas", page, perPage, search],
        queryFn: () => getKpasPaginated(page, perPage, search),
        placeholderData: (prev) => prev,
        staleTime: 1000 * 10,
    });
}

export function useSearchKpas(search: string, page: number, limit: number){
    return useQuery({
        queryKey: ["search-kpas", search, page, limit],
        queryFn: () => fetchSearchKpas(search, page, limit),
    })
}