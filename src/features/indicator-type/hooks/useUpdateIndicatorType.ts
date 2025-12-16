import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateIndicatorType } from "../services/indicatortype.api";
import type { IndicatorTypeDTO } from "../types/IndicatorTypeType";
import { toast } from "sonner";

export function useUpdateIndicatorType(){
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({id, dto} : {id: number, dto: IndicatorTypeDTO})=>
            updateIndicatorType(id, dto),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["types"] });
        },

        onError: (err: any) => {
        const message = err?.response?.data?.message ?? err?.message ?? "Error updating";
        toast.error(message);
        },
    })
}