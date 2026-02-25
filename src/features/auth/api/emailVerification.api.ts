import { apiClient } from "@/shared/lib/axios";
import { toast } from "sonner";
import { AxiosError, type AxiosResponse } from "axios";

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Resend email verification link to the user
 * @param email - User's email address
 * @returns Promise with API response
 * @throws Error on network issues or server errors
 */
export async function resendVerificationEmail(
  email: string
): Promise<ApiResponse> {
  try {
    const { data } = await apiClient.post<ApiResponse>("/email/resend", {
      email,
    });

    toast.success("Verification email sent", {
      description: "Please check your inbox",
      duration: 5000,
    });

    return data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const status = axiosError.response?.status;
    const message = axiosError.response?.data?.message;

    if (status === 422) {
      // Validation error - don't expose if user exists or not
      const lowerMessage = message?.toLowerCase() || "";
      
      if (lowerMessage.includes("already verified")) {
        toast.error("Email already verified", {
          description: "This email has already been verified. You can login now.",
        });
      } else {
        // Generic message - don't reveal if email exists or not
        toast.error("Unable to send verification email", {
          description: "Please check your email address and try again.",
        });
      }
    } else if (status === 429) {
      // Rate limit exceeded
      toast.error("Too many requests", {
        description: "Please wait a few minutes before requesting again.",
        duration: 8000,
      });
    } else if (status === 500) {
      toast.error("Server error", {
        description: "Please try again later.",
      });
    } else if (!status) {
      toast.error("Connection error", {
        description:
          "Unable to connect to the server. Please check your internet connection.",
      });
    } else {
      // Generic error - never expose backend message
      toast.error("Error sending email", {
        description: "An unexpected error occurred. Please try again.",
      });
    }

    throw error;
  }
}

/**
 * Sanitize backend error messages to prevent exposing sensitive information
 * @param message - Original backend error message
 * @param status - HTTP status code
 * @returns User-friendly, secure error message
 */
function sanitizeVerificationError(
  message: string | undefined,
  status: number | undefined
): string {
  // Never expose: user IDs, database info, stack traces, or technical details
  
  if (!message) {
    return "This verification link is no longer valid.";
  }

  const lowerMessage = message.toLowerCase();

  // User already verified
  if (lowerMessage.includes("already verified") || lowerMessage.includes("already been verified")) {
    return "This email has already been verified. You can proceed to login.";
  }

  // Link expired
  if (lowerMessage.includes("expired") || status === 410) {
    return "This verification link has expired. Please request a new one.";
  }

  // Invalid signature or hash
  if (lowerMessage.includes("invalid") || lowerMessage.includes("signature")) {
    return "This verification link is invalid.";
  }

  // User not found, deleted, or any database error
  // NEVER expose that a user exists/doesn't exist or their ID
  if (
    lowerMessage.includes("not found") ||
    lowerMessage.includes("user") ||
    lowerMessage.includes("id:") ||
    status === 404
  ) {
    return "This verification link is no longer valid.";
  }

  // Generic fallback - never show the original message
  return "Unable to verify email. Please contact support if this problem persists.";
}

/**
 * Verify user's email using the verification link parameters
 * @param id - User ID
 * @param hash - Verification hash
 * @param queryString - Full query string with expires and signature
 * @returns Promise with API response
 */
export async function verifyEmail(
  id: string,
  hash: string,
  queryString: string
): Promise<ApiResponse> {
  try {
    const { data } = await apiClient.get<ApiResponse>(
      `/email/verify/${id}/${hash}${queryString}`
    );

    return data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; success?: boolean }>;
    const status = axiosError.response?.status;
    const backendMessage = axiosError.response?.data?.message;

    // Sanitize error message - never expose technical details
    const userMessage = sanitizeVerificationError(backendMessage, status);

    // Return a sanitized error response
    const sanitizedError = new Error(userMessage) as AxiosError<{ message: string }>;
    if (axiosError.response) {
      sanitizedError.response = {
        ...axiosError.response,
        data: { message: userMessage },
      } as AxiosResponse<{ message: string }>;
    }

    throw sanitizedError;
  }
}
