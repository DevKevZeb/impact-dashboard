import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "../api/emailVerification.api";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { AxiosError } from "axios";

type VerificationStatus = "loading" | "success" | "error";

interface ApiErrorResponse {
  message?: string;
}

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const processVerification = async () => {
      const id = searchParams.get("id");
      const hash = searchParams.get("hash");
      const expires = searchParams.get("expires");
      const signature = searchParams.get("signature");

      // Validate all required parameters are present
      if (!id || !hash || !expires || !signature) {
        setStatus("error");
        setMessage("Invalid verification link. Missing required parameters.");
        return;
      }

      // Build query string
      const queryString = `?expires=${expires}&signature=${signature}`;

      try {
        const response = await verifyEmail(id, hash, queryString);

        if (response.success) {
          setStatus("success");
          // Use a generic success message - don't expose backend details
          setMessage(
            "Email verified successfully! Your account is now pending administrator approval."
          );

          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 3000);
        } else {
          setStatus("error");
          // Generic error - never expose backend message
          setMessage("This verification link is no longer valid.");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        // The error message is already sanitized by the API function
        // Never expose: user IDs, database info, or technical details
        const errorMessage =
          axiosError.response?.data?.message ||
          "This verification link is no longer valid.";

        setStatus("error");
        setMessage(errorMessage);
      }
    };

    processVerification();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl font-bold text-white">P</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pacific Ecommerce
          </h1>
          <p className="text-gray-600">Program Management System</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {status === "loading" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verifying Your Email
              </h2>
              <p className="text-gray-600">
                Please wait while we verify your email address...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Email Verified Successfully!
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>

              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Redirecting to login in 3 seconds...
                </p>
                <Button
                  onClick={() => navigate("/login", { replace: true })}
                  className="w-full"
                  size="lg"
                >
                  Go to Login Now
                </Button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-gray-700">
                  <strong>ℹ️ Note:</strong> Your account is pending
                  administrator approval. You'll receive an email notification
                  when approved.
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verification Failed
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>

              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/register", { replace: true })}
                  className="w-full"
                  size="lg"
                >
                  Register Again
                </Button>
                <Button
                  onClick={() => navigate("/login", { replace: true })}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Go to Login
                </Button>
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-gray-700">
                  <strong>💡 Need help?</strong> If you're unable to verify
                  your email, please contact our support team for assistance.
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          © {new Date().getFullYear()} Pacific Ecommerce. All rights reserved.
        </p>
      </div>
    </div>
  );
}
