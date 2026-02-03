import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "../services/project.api";
import { toast } from "sonner";

export function useCreateProject(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProject,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
        onError: (err: any) => {
          const message = err?.response?.data?.message ?? err?.message ?? "Error updating project";
          toast.error(message);
        },
    })
}