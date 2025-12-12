import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMeasure } from "../services/measure.api";

export function useCreateMeasure(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createMeasure,
        onSuccess: () =>{
            queryClient.invalidateQueries({ queryKey: ["countries"]})
        }
    })
}