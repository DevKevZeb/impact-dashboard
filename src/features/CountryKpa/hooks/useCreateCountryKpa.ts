import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCountryKpa } from "../services/countrykpa.api";

export function useCreateCountryKpa(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCountryKpa,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["country-kpas"]});

        },
    });
}