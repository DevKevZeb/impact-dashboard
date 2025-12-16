import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createIndicatorType } from "../services/indicatortype.api";

export function useCreateIndicatorType(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createIndicatorType,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["types"]})
        }
    })
}