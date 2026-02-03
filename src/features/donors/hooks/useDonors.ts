import { useQuery } from "@tanstack/react-query";
import { getDonorsPaginated } from "../services/donor.api";

export function useDonors(page: number, perPage:number, search: string) {
    return useQuery({
        queryKey: ['donors', page, perPage, search],
        queryFn: () => getDonorsPaginated(page, perPage, search),
        placeholderData: (prev) => prev,
        staleTime: 1000 * 10,
    })
}