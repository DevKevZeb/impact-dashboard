import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateKpaDto } from "../types/KpaType";
import { updateKpa } from "../services/kpa.api";
import { toast } from "sonner";

export function useUpdateKpa(){
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({id, dto}: {id: number, dto: UpdateKpaDto}) =>
            updateKpa(id, dto),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["kpas"]});
        },

        onError: (err: AxiosError<{ message?: string }>) => {
        const message = err?.response?.data?.message ?? err?.message ?? "Error updating";
        toast.error(message);
    }, 
    })
}