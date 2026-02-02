import { useQuery } from "@tanstack/react-query";
import { getBeneficiariesPaginated } from "../service/beneficiaries.api";

export function useBeneficiaries(page: number, perPage:number, search: string) {
    return useQuery({
        queryKey: ['beneficiaries', page, perPage, search],
        queryFn: () =>  getBeneficiariesPaginated(page, perPage, search),
        placeholderData: (prev) => prev,
        staleTime: 1000 * 10,
    })
}