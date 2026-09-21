import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateCountryKpaDTO } from "../types/CountryKpaType";
import { updateCountryKpa } from "../services/countrykpa.api";
import { toast } from "sonner";

export function useUpdateCountryKpa(){
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({id, dto}: {id: number; dto: UpdateCountryKpaDTO}) => 
            updateCountryKpa(id, dto),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ["agencies", "kpas"]});
        },
        onError: (err: AxiosError<{ message?: string }>) => {
            const message = err?.response?.data?.message ?? err?.message ?? "Error updating";
            toast.error(message);
    }})
}