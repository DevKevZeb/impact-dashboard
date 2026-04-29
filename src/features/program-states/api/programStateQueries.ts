import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { programStateService } from "./programStateService";
import type {
  ProgramState,
  ProgramStateCreateInput,
  ProgramStateUpdateInput,
} from "../types/programState.types";
import type { AxiosError } from "axios";

// Query keys for cache management
export const programStateKeys = {
  all: ["program-states"] as const,
  lists: () => [...programStateKeys.all, "list"] as const,
  detail: (id: number) => [...programStateKeys.all, "detail", id] as const,
};

// API Error interface
interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: {
        name?: string[];
      };
    };
  };
}

// Get all program states
export function useProgramStates(): UseQueryResult<ProgramState[], Error> {
  return useQuery({
    queryKey: programStateKeys.lists(),
    queryFn: programStateService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get paginated program states
export function useProgramStatesPaginated(page: number, perPage: number) {
  return useQuery({
    queryKey: [...programStateKeys.lists(), page, perPage],
    queryFn: () => programStateService.getPaginated(page, perPage),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get single program state by ID
export function useProgramState(
  id: number
): UseQueryResult<ProgramState, Error> {
  return useQuery({
    queryKey: programStateKeys.detail(id),
    queryFn: () => programStateService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Create program state mutation
export function useCreateProgramState(): UseMutationResult<
  ProgramState,
  AxiosError,
  ProgramStateCreateInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: programStateService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programStateKeys.lists() });
      toast.success("Program status created successfully");
    },
    onError: (error: AxiosError) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.errors?.name?.[0] ||
        apiError.response?.data?.message ||
        "Failed to create program status";
      toast.error(errorMessage);
    },
  });
}

// Update program state mutation
export function useUpdateProgramState(): UseMutationResult<
  ProgramState,
  AxiosError,
  { id: number; data: ProgramStateUpdateInput }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => programStateService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: programStateKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: programStateKeys.detail(variables.id),
      });
      toast.success("Program status updated successfully");
    },
    onError: (error: AxiosError) => {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.errors?.name?.[0] ||
        apiError.response?.data?.message ||
        "Failed to update program status";
      toast.error(errorMessage);
    },
  });
}

export function useDeleteProgramState(): UseMutationResult<
  { success: boolean; message: string; data: unknown[] },
  AxiosError,
  number
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: programStateService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programStateKeys.lists() });
    },
    onError: () => {
      // Error toasts are handled in ProgramStatesPage for status-specific UX.
    },
  });
}

// Search program state by name
export function useSearchProgramState(name: string) {
  return useQuery({
    queryKey: [...programStateKeys.all, "search", name],
    queryFn: () => programStateService.search(name),
    enabled: name.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}
