import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { programService, assignmentService, inviteProgramService } from "./programService";
import type { ProgramCreateInput, ProgramUpdateInput, Program } from "../types/program.types";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/authStore";

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

export const assignmentKeys = {
  all: ["program-assignments"] as const,
  byCountryUserRole: (id: number) =>
    [...assignmentKeys.all, "by-role", id] as const,
};

export const inviteKeys = {
  all: ["program-invites"] as const,
  byOwnerAssignment: (id: number) => [...inviteKeys.all, "owner", id] as const,
  candidates: (id: number, page: number, perPage: number, search: string) =>
    [...inviteKeys.all, "candidates", id, page, perPage, search] as const,
};

export function useProgramsPaginated(
  page: number,
  perPage: number,
  enabled = true,
  contextKey: string = "global"
) {
  return useQuery({
    queryKey: [...programKeys.lists(), page, perPage, contextKey],
    queryFn: () => programService.getPaginated(page, perPage),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}

export function useMyPrograms(page: number, perPage: number) {
  const { hasCountryScope, countryUserRoleId } = useAuthStore();
  const contextKey = hasCountryScope ? `country:${countryUserRoleId}` : "admin";

  const query = useProgramsPaginated(page, perPage, true, contextKey);
  const programs: Program[] = query.data?.programs ?? [];
  const pagination = query.data?.pagination;

  return {
    programs,
    pagination,
    isLoading: query.isLoading,
    error: query.error,
    isAdmin: !hasCountryScope,
  };
}

export function useProgram(id: number) {
  return useQuery({
    queryKey: programKeys.detail(id),
    queryFn: () => programService.getById(id),
    enabled: id > 0,
  });
}

export function useProgramAssignments(
  countryUserRoleId: number,
  page = 1,
  perPage = 10
) {
  return useQuery({
    queryKey: [
      ...assignmentKeys.byCountryUserRole(countryUserRoleId),
      page,
      perPage,
    ],
    queryFn: () =>
      assignmentService.getByCountryUserRole(countryUserRoleId, page, perPage),
    staleTime: 5 * 60 * 1000,
    enabled: countryUserRoleId > 0, 
  });
}

export function useInviteCandidates(
  ownerAssignmentId: number,
  page = 1,
  perPage = 10,
  search = "",
  enabled = true
) {
  return useQuery({
    queryKey: inviteKeys.candidates(ownerAssignmentId, page, perPage, search),
    queryFn: () =>
      inviteProgramService.getCandidates({
        programCountryUserRoleId: ownerAssignmentId,
        page,
        perPage,
        search,
      }),
    staleTime: 60 * 1000,
    enabled: enabled && ownerAssignmentId > 0,
  });
}

export function useProgramInvitesByOwner(ownerAssignmentId: number, enabled = true) {
  return useQuery({
    queryKey: inviteKeys.byOwnerAssignment(ownerAssignmentId),
    queryFn: () =>
      inviteProgramService.getByOwnerAssignment({
        programCountryUserRoleId: ownerAssignmentId,
      }),
    staleTime: 30 * 1000,
    enabled: enabled && ownerAssignmentId > 0,
  });
}

export function useCreateProgramInvite(ownerAssignmentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitedUserRoleId: number) =>
      inviteProgramService.create({
        program_country_user_role_id: ownerAssignmentId,
        invited_user_role_id: invitedUserRoleId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inviteKeys.byOwnerAssignment(ownerAssignmentId) });
      queryClient.invalidateQueries({ queryKey: inviteKeys.all });
      toast.success("Invitation created successfully");
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message ?? "Failed to create invitation";
      toast.error("Error creating invitation", { description: errorMessage });
    },
  });
}

export function useCancelProgramInvite(ownerAssignmentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: number) => inviteProgramService.delete(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inviteKeys.byOwnerAssignment(ownerAssignmentId) });
      queryClient.invalidateQueries({ queryKey: inviteKeys.all });
      toast.success("Invitation cancelled successfully");
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message ?? "Failed to cancel invitation";
      toast.error("Error cancelling invitation", { description: errorMessage });
    },
  });
}

export function useCreateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ProgramCreateInput) => {
      const program = await programService.create(input);

      const { hasCountryScope, countryUserRoleId } = useAuthStore.getState();
      if (hasCountryScope) {
        await assignmentService.create({
          program_id: program.id,
          country_user_role_id: countryUserRoleId,
        });
      }

      return program;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.all });
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
