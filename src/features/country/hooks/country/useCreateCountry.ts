import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCountry } from "../../services/country.api";

export function useCreateCountry(){
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: createCountry,
        onSuccess: () =>{
            queryClient.invalidateQueries({ queryKey: ["countries"]}),
            queryClient.invalidateQueries({ queryKey: ["currencies"] })
        }
    })
}