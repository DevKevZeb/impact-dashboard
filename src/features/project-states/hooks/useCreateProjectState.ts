import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProjectState } from "../service/projectstate.api";

export function useCreateProjectState(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProjectState,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["project-states"] });
        },
        onError: (err: any) => {
          const message = err?.response?.data?.message ?? err?.message ?? "Error updating project";
          console.error(message);
        },
    })
}