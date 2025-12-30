import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDonor } from "../services/donor.api";

export function useCreateDonor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createDonor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["donors"] });
        }
    })
}