import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBeneficiary } from "../service/beneficiaries.api";
import type { BeneficiaryDTO } from "../types/beneficiaries.types";
import { toast } from "sonner";

export function useUpdateBeneficiary(){
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({id, dto}: {id: number, dto: BeneficiaryDTO}) =>
            updateBeneficiary(id, dto),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["beneficiaries"] });
        },
        onError: (err: any) => {
            const message = err?.response?.data?.message ?? err?.message ?? "Error updating";
            toast.error(message);
        },
    })
}