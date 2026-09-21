import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateIndicator } from "../services/indicator.api";
import type { UpdateIndicatorDTO } from "../types/indicatorTypes";
import { toast } from "sonner";

export function useUpdateIndicator(){
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({id, dto} : {id: number, dto: UpdateIndicatorDTO}) =>
            updateIndicator(id, dto),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["indicators"]})
        },
        onError: (err: AxiosError<{ message?: string }>) => {
            const message = err?.response?.data?.message ?? err?.message ?? "Error updating";
            toast.error(message); 
        }
    })
}