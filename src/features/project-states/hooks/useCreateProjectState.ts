import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProjectState } from "../service/projectstate.api";

export function useCreateProjectState(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProjectState,
        onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-states"] });
    },
    })
}