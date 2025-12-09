import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createKpa } from "../services/kpa.api";

export function useCreateKpa(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createKpa,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["kpas"]})
        }
    })
}