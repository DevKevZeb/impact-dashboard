import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProjectStateDTO } from "../types/projectstate.types";
import { updateProjectState } from "../service/projectstate.api";
import { toast } from "sonner";

export function useUpdateProjectState(){
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({id, dto}: {id: number, dto: ProjectStateDTO}) =>
            updateProjectState(id, dto),
        onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["project-states"] });
        },
        onError: (err: any) => {
        const message = err?.response?.data?.message ?? err?.message ?? "Error updating";
        toast.error(message);
        },
        })
}