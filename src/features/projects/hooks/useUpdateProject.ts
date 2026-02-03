import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProjectDTO } from "../types/project.types";
import { updateProject } from "../services/project.api";

export function useUpdateProject(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, dto}: {id: number, dto: ProjectDTO}) => updateProject(id, dto),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
        onError: (err: any) => {
          const message = err?.response?.data?.message ?? err?.message ?? "Error updating project";
          console.error(message);
        }

    })
}