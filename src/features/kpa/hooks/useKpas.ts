import { useQuery } from "@tanstack/react-query";
import { fetchSearchKpas, getKpasPaginated } from "../services/kpa.api";

export function useKpas(page: number, perPage: number) {
    return useQuery({
        queryKey: ["kpas", page, perPage],
        queryFn: () => getKpasPaginated(page, perPage)
    });
}

export function useSearchKpas(search: string, page: number){
    return useQuery({
        queryKey: ["search-kpas", search, page],
        queryFn: () => fetchSearchKpas(search, page),
    })
}