import axios, { AxiosError } from "axios";

// Tipos de respuesta reutilizables
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface ValidationErrorResponse {
  success: false;
  message: string;
  errors: {
    [field: string]: string[];
  };
}

export interface BusinessErrorResponse {
  success: false;
  message: string;
  data: [];
}

// Cliente Axios público
export const publicApiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/public`,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  timeout: 30000,
});

// Interceptor de respuesta (solo manejo básico de errores)
publicApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ValidationErrorResponse | BusinessErrorResponse>) => {
    const status = error.response?.status;

    if (status === 422) {
      console.error("Validation error:", error.response?.data);
    }

    if (status === 400) {
      console.error("Business error:", error.response?.data);
    }

    if (error.message === "Network Error") {
      console.error("Network error - Backend might be down");
    }

    return Promise.reject(error);
  }
);
