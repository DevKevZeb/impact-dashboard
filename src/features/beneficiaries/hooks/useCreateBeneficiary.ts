import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBeneficiary } from "../service/beneficiaries.api";

export function useCreateBeneficiary(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBeneficiary,
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
        },
    })
}