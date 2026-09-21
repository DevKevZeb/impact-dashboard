import { useMemo, useState } from "react";
import { AxiosError } from "axios";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useCreateAdminUser } from "../api/userQueries";
import { createAdminSchema, type CreateAdminFormData } from "../types/createAdmin.schema";
import type { ValidationErrorResponse } from "@/shared/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateAdminFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateAdminForm({ onSuccess, onCancel }: CreateAdminFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const createAdminMutation = useCreateAdminUser();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateAdminFormData>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const watchedPassword = useWatch({ control, name: "password", defaultValue: "" });

  const passwordStrength = useMemo(() => {
    const password = watchedPassword;
    if (!password) {
      return { score: 0, label: "No password", color: "bg-gray-300" };
    }

    let score = 0;
    if (password.length >= 6) score += 25;
    if (password.length >= 10) score += 20;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 20;

    if (score >= 80) return { score, label: "Strong", color: "bg-green-500" };
    if (score >= 50) return { score, label: "Medium", color: "bg-amber-500" };
    return { score, label: "Weak", color: "bg-red-500" };
  }, [watchedPassword]);

  const onSubmit = async (values: CreateAdminFormData) => {
    setApiError("");

    try {
      await createAdminMutation.mutateAsync(values);
      reset();
      onSuccess?.();
    } catch (error) {
      const axiosError = error as AxiosError<ValidationErrorResponse | { message?: string }>;
      const status = axiosError.response?.status;

      if (status === 422) {
        const payload = axiosError.response?.data as ValidationErrorResponse | undefined;
        const backendErrors = payload?.errors ?? {};

        Object.entries(backendErrors).forEach(([field, messages]) => {
          const message = Array.isArray(messages) ? messages[0] : "Invalid value";
          if (field in values) {
            setError(field as keyof CreateAdminFormData, { message });
          }
        });

        return;
      }

      setApiError(axiosError.response?.data?.message || "Unable to create administrator");
    }
  };

  return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {apiError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {apiError}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="admin-name">Full name <span className="text-red-500">*</span></Label>
            <Input
              id="admin-name"
              type="text"
              maxLength={255}
              autoComplete="name"
              placeholder="Jane Doe"
              disabled={isSubmitting || createAdminMutation.isPending}
              {...register("name")}
            />
            {errors.name ? <p className="text-sm text-red-600">{errors.name.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-email">Email <span className="text-red-500">*</span></Label>
            <Input
              id="admin-email"
              type="email"
              maxLength={255}
              autoComplete="email"
              placeholder="jane.admin@example.com"
              disabled={isSubmitting || createAdminMutation.isPending}
              {...register("email")}
            />
            {errors.email ? <p className="text-sm text-red-600">{errors.email.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password">Password <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                disabled={isSubmitting || createAdminMutation.isPending}
                {...register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div
                  className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                  style={{ width: `${Math.min(passwordStrength.score, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">Password strength: {passwordStrength.label}</p>
            </div>
            {errors.password ? <p className="text-sm text-red-600">{errors.password.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password-confirmation">Confirm password <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                id="admin-password-confirmation"
                type={showPasswordConfirmation ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat password"
                disabled={isSubmitting || createAdminMutation.isPending}
                {...register("password_confirmation")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => setShowPasswordConfirmation((prev) => !prev)}
                aria-label={showPasswordConfirmation ? "Hide password confirmation" : "Show password confirmation"}
              >
                {showPasswordConfirmation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {errors.password_confirmation ? (
              <p className="text-sm text-red-600">{errors.password_confirmation.message}</p>
            ) : null}
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || createAdminMutation.isPending}
              className="min-w-44"
            >
              {isSubmitting || createAdminMutation.isPending ? "Creating..." : "Create"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting || createAdminMutation.isPending}
              onClick={() => {
                setApiError("");
                reset();
                onCancel?.();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
  );
}
