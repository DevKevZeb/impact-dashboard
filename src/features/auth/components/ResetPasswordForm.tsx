import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { resetPasswordSchema, type ResetPasswordFormData } from "../types/passwordReset.schema";
import { useResetPassword } from "../api/passwordResetQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AxiosError } from "axios";

interface ApiValidationError {
  message?: string;
  errors?: Record<string, string[]>;
}

interface ResetPasswordFormProps {
  token: string;
  email: string;
}

export function ResetPasswordForm({ token, email }: ResetPasswordFormProps) {
  const navigate = useNavigate();
  const { mutate: submitResetPassword, isPending } = useResetPassword();
  const [submitError, setSubmitError] = useState<string>("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    setSubmitError("");

    submitResetPassword(
      {
        token,
        email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      },
      {
        onSuccess: () => {
          navigate("/login", { replace: true });
        },
        onError: (error) => {
          const axiosError = error as AxiosError<ApiValidationError>;
          const status = axiosError.response?.status;
          const responseErrors = axiosError.response?.data?.errors;

          if (status === 422 && responseErrors) {
            Object.entries(responseErrors).forEach(([field, messages]) => {
              if (messages.length > 0) {
                setError(field as keyof ResetPasswordFormData, {
                  type: "server",
                  message: messages[0],
                });
              }
            });
            return;
          }

          if (status === 400) {
            setSubmitError(
              "This reset link is no longer valid or has expired. Please request a new one."
            );
            return;
          }

          setSubmitError("Unable to reset your password right now. Please try again.");
        },
      }
    );
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Reset Password
        </CardTitle>
        <CardDescription className="text-center">
          Create a new password for {email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitError && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="mb-3">{submitError}</p>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/forgot-password")}
            >
              Request a new reset link
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
              disabled={isPending}
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Confirm password</Label>
            <Input
              id="password_confirmation"
              type="password"
              placeholder="Repeat your new password"
              autoComplete="new-password"
              disabled={isPending}
              {...register("password_confirmation")}
              className={errors.password_confirmation ? "border-red-500" : ""}
            />
            {errors.password_confirmation && (
              <p className="text-sm text-red-600">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Resetting..." : "Reset password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}