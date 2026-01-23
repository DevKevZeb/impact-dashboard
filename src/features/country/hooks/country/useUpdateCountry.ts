import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateCountryDTO } from "../../types/CountryType";
import { updateCountry } from "../../services/country.api";
import { toast } from "sonner";

export function useUpdateCountry(){
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({id, dto}: {id: number; dto: UpdateCountryDTO}) => 
            updateCountry(id, dto),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["countries"]});
            qc.invalidateQueries({ queryKey: ["currencies"] });
        },
        onError: (err: any) => {
            const message = err?.response?.data?.message ?? err?.message ?? "Error updating";
        toast.error(message); 
        }

    })
}