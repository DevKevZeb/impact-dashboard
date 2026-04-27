import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { countryDashboardShareService } from "./countryDashboardShare.service";
import type { CreateCountryDashboardShareInput } from "../types/countryDashboardShare.types";

export const countryDashboardShareKeys = {
  all: ["country-dashboard-shares"] as const,
  adminCandidates: () => [...countryDashboardShareKeys.all, "admin-candidates"] as const,
  myShares: () => [...countryDashboardShareKeys.all, "my-shares"] as const,
  visibleForAdmin: () => [...countryDashboardShareKeys.all, "visible-for-admin"] as const,
};

export function useCountryDashboardShareAdminCandidates(page: number = 1, perPage: number = 50) {
  return useQuery({
    queryKey: [...countryDashboardShareKeys.adminCandidates(), page, perPage],
    queryFn: () => countryDashboardShareService.getAdminCandidates(page, perPage),
    staleTime: 30 * 1000,
  });
}

export function useMyCountryDashboardShares(page: number = 1, perPage: number = 50) {
  return useQuery({
    queryKey: [...countryDashboardShareKeys.myShares(), page, perPage],
    queryFn: () => countryDashboardShareService.getMyShares(page, perPage),
    staleTime: 30 * 1000,
  });
}

export function useVisibleCountryDashboardSharesForAdmin(page: number = 1, perPage: number = 50) {
  return useQuery({
    queryKey: [...countryDashboardShareKeys.visibleForAdmin(), page, perPage],
    queryFn: () => countryDashboardShareService.getVisibleForAdmin(page, perPage),
    staleTime: 30 * 1000,
  });
}

export function useCreateCountryDashboardShare() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCountryDashboardShareInput) => countryDashboardShareService.createShare(input),
    onSuccess: () => {
      toast.success("Country dashboard shared successfully");
      queryClient.invalidateQueries({ queryKey: countryDashboardShareKeys.all });
    },
    onError: (error: Error) => {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
        "Failed to share country dashboard";
      toast.error(message);
    },
  });
}

export function useDeleteCountryDashboardShare() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shareId: number) => countryDashboardShareService.deleteShare(shareId),
    onSuccess: () => {
      toast.success("Country dashboard share revoked successfully");
      queryClient.invalidateQueries({ queryKey: countryDashboardShareKeys.all });
    },
    onError: (error: Error) => {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
        "Failed to revoke country dashboard share";
      toast.error(message);
    },
  });
}
