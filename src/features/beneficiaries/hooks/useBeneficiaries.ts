import { useQuery } from "@tanstack/react-query";
import { getBeneficiariesPaginated } from "../service/beneficiaries.api";

export function useBeneficiaries(page: number, perPage:number) {
    return useQuery({
        queryKey: ['beneficiaries', page, perPage],
        queryFn: () =>  getBeneficiariesPaginated(page, perPage)
    })
}