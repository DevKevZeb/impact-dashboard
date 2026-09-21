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
import { RefreshCw, Sparkles } from "lucide-react";

const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";
// Mirrors the DEMO_*_CREDENTIALS constants in src/mocks/fixtures/demoAuth.ts
// (duplicated, rather than imported, so this file never pulls the mocks
// tree into the real production bundle).
const DEMO_PERSONAS = [
  { label: "Admin", credentials: { email: "demo@admin.com", password: "demo1234" } },
  { label: "Country Manager", credentials: { email: "demo@country.com", password: "demo1234" } },
  { label: "Project Manager", credentials: { email: "demo@projects.com", password: "demo1234" } },
];

export function LoginForm() {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();
  const [authMessage, setAuthMessage] = useState<string>("");
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

  const loginWithDemoPersona = (credentials: LoginFormData) => {
    onSubmit(credentials);
  };

  const onSubmit = (data: LoginFormData) => {
    setLoginEmail(data.email);
    setAuthMessage("");
    setShowResendButton(false);

    login(data, {
      onError: (error) => {
        const axiosError = error as AxiosError<{ message?: string }>;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || "";

        if (status === 401) {
          setAuthMessage("Invalid email or password. If you just changed your password, use the new one.");
          setShowResendButton(false);
          return;
        }

        if (status === 403) {
          // Handle different 403 scenarios
          // Never expose backend messages directly - use generic user-friendly messages
          const lowerMessage = message.toLowerCase();
          
          if (lowerMessage.includes("verify") || lowerMessage.includes("email")) {
            setAuthMessage("Please verify your email before logging in.");
            setShowResendButton(true);
          } else if (lowerMessage.includes("pending") || lowerMessage.includes("approval")) {
            setAuthMessage(
              "Your account is pending administrator approval. You'll receive an email notification when approved."
            );
            setShowResendButton(false);
          } else if (lowerMessage.includes("inactive") || lowerMessage.includes("deactivated")) {
            setAuthMessage(
              "Your account is not currently active. Please contact support for assistance."
            );
            setShowResendButton(false);
          } else {
            // Generic message - never expose backend details
            setAuthMessage(
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

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm font-medium text-blue-600 hover:underline disabled:opacity-50"
              disabled={isPending}
            >
              Forgot your password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Sign In"}
          </Button>

          {IS_DEMO_MODE && (
            <div className="pt-4 mt-2 border-t border-dashed space-y-2">
              <p className="text-xs text-center text-gray-500">
                Portfolio demo &middot; this app enforces the real role-based
                permission model &mdash; try each role to see what it can (and can't) do:
              </p>
              {DEMO_PERSONAS.map((persona) => (
                <Button
                  key={persona.credentials.email}
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={isPending}
                  onClick={() => loginWithDemoPersona(persona.credentials)}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Login as Demo {persona.label}
                </Button>
              ))}
              <p className="text-xs text-center text-gray-500">
                Or sign in manually with any of the emails above and password <code>demo1234</code>
              </p>
            </div>
          )}
        </form>

        {/* 403 Error Message Display */}
        {authMessage && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 text-center mb-3">
              {authMessage}
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
