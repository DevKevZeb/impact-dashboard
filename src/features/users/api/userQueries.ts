import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "./user.service";
import { toast } from "sonner";

export const userKeys = {
  all: ["users"] as const,
  pending: () => [...userKeys.all, "pending"] as const,
  list: () => [...userKeys.all, "list"] as const,
};

export function usePendingUsers(page: number = 1, perPage: number = 10) {
  return useQuery({
    queryKey: [...userKeys.pending(), page, perPage],
    queryFn: () => userService.getPendingUsers(page, perPage),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useAllUsers(page: number = 1, perPage: number = 10) {
  return useQuery({
    queryKey: [...userKeys.list(), page, perPage],
    queryFn: () => userService.getAllUsers(page, perPage),
    staleTime: 1 * 60 * 1000,
  });
}

export function useApproveUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => userService.approveUser(userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success(`User ${data.name} approved successfully`);
    },
    onError: (error: Error) => {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to approve user";
      toast.error(message);
    },
  });
}

export function useRejectUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => userService.rejectUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("User deleted successfully");
    },
    onError: (error: Error) => {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to reject user";
      toast.error(message);
    },
  });
}
