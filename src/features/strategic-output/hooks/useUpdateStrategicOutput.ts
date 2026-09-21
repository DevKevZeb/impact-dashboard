import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateStrategicOutputDTO } from "../types/StrategicOutput";
import { updateStrategicOutput } from "../services/strategic-output.api";
import { toast } from "sonner";

export function useUpdateStrategicOutput(){
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({id, dto}: {id: number; dto: UpdateStrategicOutputDTO}) =>
            updateStrategicOutput(id, dto),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["so"]})
        },
        onError: (err: AxiosError<{ message?: string }>) => {
            const message = err?.response?.data?.message ?? err?.message ?? "Error updating";
        toast.error(message); 
        }
    })
}