import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProjectDTO } from "../types/project.types";
import { updateProject } from "../services/project.api";

export function useUpdateProject(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, dto}: {id: number, dto: ProjectDTO}) => updateProject(id, dto),
        onSuccess: () => (_data: any, variables: {id: number} ) => {
          queryClient.invalidateQueries({ queryKey: ["projects"], exact: false});
          queryClient.invalidateQueries({queryKey: ["project", variables.id]})
        },
        onError: (err: any) => {
          const message = err?.response?.data?.message ?? err?.message ?? "Error updating project";
          console.error(message);
        }

    })
}