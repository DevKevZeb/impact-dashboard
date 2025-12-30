import { useQuery } from "@tanstack/react-query";
import { getDonorsPaginated } from "../services/donor.api";

export function useDonors(page: number, perPage:number) {
    return useQuery({
        queryKey: ['donors', page, perPage],
        queryFn: () => getDonorsPaginated(page, perPage)
    })
}