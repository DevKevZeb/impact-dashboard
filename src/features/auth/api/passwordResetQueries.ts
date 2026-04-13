import { useMutation } from "@tanstack/react-query";
import { forgotPassword, resetPassword } from "./passwordReset.api";
import type { ForgotPasswordInput, ResetPasswordInput } from "../types/passwordReset.types";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) => forgotPassword(input),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (input: ResetPasswordInput) => resetPassword(input),
  });
}