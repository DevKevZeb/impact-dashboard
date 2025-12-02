import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - garbage collection time
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof AxiosError && error.response?.status) {
          const status = error.response.status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      refetchOnWindowFocus: false, // Don't refetch on window focus by default
    },
    mutations: {
      onError: (error) => {
        // Global error handling for mutations
        if (error instanceof AxiosError) {
          const status = error.response?.status;
          const message = error.response?.data?.message;

          if (status === 422) {
            toast.error("Error de validación", {
              description: "Por favor revisa los campos del formulario",
            });
          } else if (status === 400) {
            toast.error("Error", {
              description: message || "Ocurrió un error al procesar la solicitud",
            });
          } else if (status === 500) {
            toast.error("Error del servidor", {
              description: "Por favor intenta nuevamente más tarde",
            });
          } else {
            toast.error("Error", {
              description: message || "Ocurrió un error inesperado",
            });
          }
        }
      },
    },
  },
});
