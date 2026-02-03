import { useMutation } from "@tanstack/react-query";
import { register } from "./register.api";
import type { RegisterInput } from "../types/register.types";

export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
  });
}
