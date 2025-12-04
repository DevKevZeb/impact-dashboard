import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";


// API Response Types
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

// Create axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ValidationErrorResponse | BusinessErrorResponse>) => {
    // Handle 401 Unauthorized - Redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Handle 422 Validation Errors
    if (error.response?.status === 422) {
      const validationError = error.response.data as ValidationErrorResponse;
      console.error("Validation errors:", validationError.errors);
      return Promise.reject(error);
    }

    // Handle 400 Business Logic Errors
    if (error.response?.status === 400) {
      const businessError = error.response.data as BusinessErrorResponse;
      console.error("Business error:", businessError.message);
      return Promise.reject(error);
    }

    // Handle network errors
    if (error.message === "Network Error") {
      console.error("Network error - Backend might be down");
    }

    return Promise.reject(error);
  }
);
