import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateMeasureDTO } from "../types/measureTypes";
import { updateMeasure } from "../services/measure.api";
import { toast } from "sonner";

export function useUpdateMeasure(){
    const qc = useQueryClient();

    return useMutation({
         mutationFn: ({id, dto}: {id: number; dto: UpdateMeasureDTO}) =>
            updateMeasure(id, dto),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["measures"]})
        },
        onError: (err: any) => {
            const message = err?.response?.data?.message ?? err?.message ?? "Error updating";
            toast.error(message); 
        }
    })
}