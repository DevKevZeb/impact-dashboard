import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStrategicOutput } from "../services/strategic-output.api";

export function useCreateStrategicOutput(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createStrategicOutput,
        onSuccess: () =>{
            queryClient.invalidateQueries({ queryKey: ["countries"]})
        }
    })
}   