import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DonorDTO } from "../types/donor.types";
import { updateDonor } from "../services/donor.api";
import { toast } from "sonner";

export function useUpdateDonor(){
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({id, dto}: {id: number, dto: DonorDTO}) =>
            updateDonor(id, dto),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["donors"] });
        },
        onError: (err: AxiosError<{ message?: string }>) => {
            const message = err?.response?.data?.message ?? err?.message ?? "Error updating";
            toast.error(message);
        },

    })
}