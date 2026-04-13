import { apiClient } from "@/shared/lib/axios";
import type { ForgotPasswordInput, ResetPasswordInput } from "../types/passwordReset.types";

const AUTH_ENDPOINT = "/auth";

export async function forgotPassword(input: ForgotPasswordInput): Promise<void> {
  await apiClient.post(`${AUTH_ENDPOINT}/forgot-password`, input);
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  await apiClient.post(`${AUTH_ENDPOINT}/reset-password`, input);
}