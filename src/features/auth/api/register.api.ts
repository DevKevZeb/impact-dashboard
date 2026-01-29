import { apiClient, type ApiResponse } from "@/shared/lib/axios";
import type { RegisterInput, RegisterResponse } from "../types/register.types";
import { toast } from "sonner";
import { AxiosError } from "axios";

const AUTH_ENDPOINT = "/auth";

export async function register(input: RegisterInput): Promise<RegisterResponse> {
  try {
    const { data } = await apiClient.post<ApiResponse<RegisterResponse>>(
      `${AUTH_ENDPOINT}/register`,
      input
    );

    if (data.success) {
      toast.success("Registration successful!", {
        description: data.message || "Your account has been created and is pending approval",
        duration: 8000,
      });
      return data.data;
    }

    throw new Error(data.message);
  } catch (error) {
    const axiosError = error as AxiosError<{ 
      message?: string; 
      errors?: Record<string, string[]>;
    }>;
    const status = axiosError.response?.status;
    const responseData = axiosError.response?.data;

    if (status === 422) {
      // Validation errors
      const errors = responseData?.errors;
      if (errors && Object.keys(errors).length > 0) {
        // Get all error messages
        const errorMessages = Object.values(errors).flat();
        
        if (errorMessages.length === 1) {
          // Single error: show it directly without generic title
          toast.error(errorMessages[0]);
        } else if (errorMessages.length > 1) {
          // Multiple errors: show as a list
          const errorList = errorMessages.map((msg) => `• ${msg}`).join('\n');
          toast.error("Please correct the following errors:", {
            description: errorList,
            duration: 6000,
          });
        }
      } else {
        // Fallback if no errors object
        toast.error(responseData?.message || "Please correct the errors in the form");
      }
    } else if (status === 400) {
      // Business logic error
      toast.error("Error", {
        description: responseData?.message || "Unable to complete registration",
      });
    } else if (status === 500) {
      toast.error("Server error", {
        description: "Please try again later",
      });
    } else {
      toast.error("Connection error", {
        description: "Please check your internet connection",
      });
    }

    throw error;
  }
}
