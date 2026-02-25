import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../types/auth.schema";
import { useLogin } from "../api/authQueries";
import { resendVerificationEmail } from "../api/emailVerification.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AxiosError } from "axios";
import { RefreshCw } from "lucide-react";

export function LoginForm() {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();
  const [error403Message, setError403Message] = useState<string>("");
  const [showResendButton, setShowResendButton] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleResendVerification = async () => {
    if (!loginEmail) return;

    setIsResending(true);
    try {
      await resendVerificationEmail(loginEmail);
      navigate("/email-verification-pending", { state: { email: loginEmail } });
    } catch (error) {
      // Error toast is shown by the API function
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = (data: LoginFormData) => {
    setLoginEmail(data.email);
    setError403Message("");
    setShowResendButton(false);

    login(data, {
      onError: (error) => {
        const axiosError = error as AxiosError<{ message?: string }>;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || "";

        if (status === 403) {
          // Handle different 403 scenarios
          // Never expose backend messages directly - use generic user-friendly messages
          const lowerMessage = message.toLowerCase();
          
          if (lowerMessage.includes("verify") || lowerMessage.includes("email")) {
            setError403Message("Please verify your email before logging in.");
            setShowResendButton(true);
          } else if (lowerMessage.includes("pending") || lowerMessage.includes("approval")) {
            setError403Message(
              "Your account is pending administrator approval. You'll receive an email notification when approved."
            );
            setShowResendButton(false);
          } else if (lowerMessage.includes("inactive") || lowerMessage.includes("deactivated")) {
            setError403Message(
              "Your account is not currently active. Please contact support for assistance."
            );
            setShowResendButton(false);
          } else {
            // Generic message - never expose backend details
            setError403Message(
              "Access denied. Please contact support if you need assistance."
            );
            setShowResendButton(false);
          }
        }
      },
    });
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Sign In
        </CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access the system
        </CardDescription>
      </CardHeader>
      <CardContent>
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

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isPending}
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* 403 Error Message Display */}
        {error403Message && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 text-center mb-3">
              {error403Message}
            </p>
            {showResendButton && (
              <Button
                onClick={handleResendVerification}
                disabled={isResending}
                variant="outline"
                className="w-full border-red-300 text-red-700 hover:bg-red-50"
                size="sm"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline font-medium"
            disabled={isPending}
          >
            Register here
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
