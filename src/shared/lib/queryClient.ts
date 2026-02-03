import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - garbage collection time
      retry: (failureCount, error) => {
        if (error instanceof AxiosError && error.response?.status) {
          const status = error.response.status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        if (error instanceof AxiosError) {
          const status = error.response?.status;
          const message = error.response?.data?.message;

          // Skip 422 validation errors - let each API service handle them
          if (status === 422) {
            return;
          }
          
          if (status === 400) {
            toast.error("Error", {
              description: message || "An error occurred while processing the request",
            });
          } else if (status === 500) {
            toast.error("Server error", {
              description: "Please try again later",
            });
          } else if (status && status >= 400) {
            toast.error("Error", {
              description: message || "An unexpected error occurred",
            });
          }
        }
      },
    },
  },
});
