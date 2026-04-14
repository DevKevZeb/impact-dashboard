import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "../types/passwordReset.schema";
import { useForgotPassword } from "../api/passwordResetQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AxiosError } from "axios";

interface ApiValidationError {
  message?: string;
  errors?: Record<string, string[]>;
}

export function ForgotPasswordForm() {
  const { mutate: submitForgotPassword, isPending } = useForgotPassword();
  const [successMessage, setSuccessMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    setSuccessMessage("");
    clearErrors();

    submitForgotPassword(data, {
      onSuccess: () => {
        setSuccessMessage(
          "If the email exists, we have sent you a link to reset your password."
        );
      },
      onError: (error) => {
        const axiosError = error as AxiosError<ApiValidationError>;
        const status = axiosError.response?.status;
        const responseErrors = axiosError.response?.data?.errors;

        if (status === 422 && responseErrors) {
          Object.entries(responseErrors).forEach(([field, messages]) => {
            if (messages.length > 0) {
              setError(field as keyof ForgotPasswordFormData, {
                type: "server",
                message: messages[0],
              });
            }
          });
        }
      },
    });
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Recover Password
        </CardTitle>
        <CardDescription className="text-center">
          Enter your email address and we will send you a reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        {successMessage && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@pacific.com"
              autoComplete="email"
              disabled={isPending}
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Sending link..." : "Send reset link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}