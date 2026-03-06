import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { programService } from "./programService";
import type { ProgramCreateInput, ProgramUpdateInput } from "../types/program.types";
import { toast } from "sonner";

interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: {
        [field: string]: string[];
      };
    };
  };
}

export const programKeys = {
  all: ["programs"] as const,
  lists: () => [...programKeys.all, "list"] as const,
  detail: (id: number) => [...programKeys.all, "detail", id] as const,
};

export function usePrograms() {
  return useQuery({
    queryKey: programKeys.lists(),
    queryFn: programService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProgramsPaginated(page: number, perPage: number) {
  return useQuery({
    queryKey: [...programKeys.lists(), page, perPage],
    queryFn: () => programService.getPaginated(page, perPage),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProgram(id: number) {
  return useQuery({
    queryKey: programKeys.detail(id),
    queryFn: () => programService.getById(id),
    enabled: id > 0,
  });
}

export function useCreateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ProgramCreateInput) => programService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
      toast.success("Program created successfully");
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      let errorMessage = "Failed to create program";
      
      // Check for validation errors (422) with specific field messages
      if (apiError.response?.data?.errors) {
        const errors = apiError.response.data.errors;
        // Get first error message from any field
        const firstError = Object.values(errors)[0]?.[0];
        if (firstError) {
          errorMessage = firstError;
        }
      } else if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      }
      
      toast.error("Error creating program", {
        description: errorMessage,
      });
    },
  });
}

export function useUpdateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: ProgramUpdateInput }) =>
      programService.update(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
      queryClient.invalidateQueries({ queryKey: programKeys.detail(variables.id) });
      toast.success("Program updated successfully");
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      
      let errorMessage = "Failed to update program";
      
      // Check for validation errors (422) with specific field messages
      if (apiError.response?.data?.errors) {
        const errors = apiError.response.data.errors;
        // Get first error message from any field
        const firstError = Object.values(errors)[0]?.[0];
        if (firstError) {
          errorMessage = firstError;
        }
      } else if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      }
      
      toast.error("Error updating program", {
        description: errorMessage,
      });
    },
  });
}
