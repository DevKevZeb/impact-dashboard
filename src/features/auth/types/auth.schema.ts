import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(255, "Name must not exceed 255 characters"),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  password: z.string().min(6, "Password must be at least 6 characters").max(255, "Password must not exceed 255 characters"),
  password_confirmation: z.string().min(1, "Password confirmation is required"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
