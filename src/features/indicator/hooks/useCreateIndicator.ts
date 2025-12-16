import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createIndicator } from "../services/indicator.api";

export function useCreateIndicator(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createIndicator,
        onSuccess: () =>{
            queryClient.invalidateQueries({ queryKey: ["indicators"]})
        }
    })
}