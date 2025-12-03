import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sdgService } from "./sdgService";
import type { SdgCreateInput, SdgUpdateInput } from "../types/sdg.types";
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

// Query Keys
export const sdgKeys = {
  all: ["sdgs"] as const,
  lists: () => [...sdgKeys.all, "list"] as const,
  details: () => [...sdgKeys.all, "detail"] as const,
  detail: (id: number) => [...sdgKeys.details(), id] as const,
  search: (filename: string) => [...sdgKeys.all, "search", filename] as const,
};

/**
 * Hook to get all SDGs
 */
export function useSdgs() {
  return useQuery({
    queryKey: sdgKeys.lists(),
    queryFn: sdgService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to get SDG by ID
 */
export function useSdg(id: number) {
  return useQuery({
    queryKey: sdgKeys.detail(id),
    queryFn: () => sdgService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to search SDG by filename
 */
export function useSdgSearch(filename: string) {
  return useQuery({
    queryKey: sdgKeys.search(filename),
    queryFn: () => sdgService.search(filename),
    enabled: filename.length >= 3,
  });
}

/**
 * Mutation to create SDG
 */
export function useCreateSdg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SdgCreateInput) => sdgService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sdgKeys.lists() });
      toast.success("SDG created successfully", {
        description: "Image uploaded successfully",
      });
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      let errorMessage = "Error creating SDG";
      
      // Check for validation errors (422) with specific field messages
      if (apiError.response?.data?.errors?.filename) {
        errorMessage = apiError.response.data.errors.filename[0];
      } else if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      }
      
      toast.error("Error", {
        description: errorMessage,
      });
    },
  });
}

/**
 * Mutation to update SDG
 */
export function useUpdateSdg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: SdgUpdateInput }) =>
      sdgService.update(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: sdgKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sdgKeys.detail(variables.id) });
      toast.success("SDG updated successfully", {
        description: "Image has been updated",
      });
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      let errorMessage = "Error updating SDG";
      
      // Check for validation errors (422) with specific field messages
      if (apiError.response?.data?.errors?.filename) {
        errorMessage = apiError.response.data.errors.filename[0];
      } else if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      }
      
      toast.error("Error", {
        description: errorMessage,
      });
    },
  });
}
