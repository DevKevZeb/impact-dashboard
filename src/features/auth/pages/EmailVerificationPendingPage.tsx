import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { resendVerificationEmail } from "../api/emailVerification.api";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";

export function EmailVerificationPendingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [isResending, setIsResending] = useState(false);

  // If no email in state, show fallback message
  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Session Expired
            </h2>
            <p className="text-gray-600">
              Please register your account again to receive a verification
              email.
            </p>
          </div>

          <Button
            onClick={() => navigate("/register")}
            className="w-full"
            size="lg"
          >
            Go to Register
          </Button>
        </div>
      </div>
    );
  }

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendVerificationEmail(email);
      // Toast is shown by the API function
    } catch {
      // Error toast is shown by the API function
    } finally {
      setIsResending(false);
    }
  };

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
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-600 mb-4">
              We've sent a verification link to:
            </p>
            <p className="text-lg font-semibold text-gray-900 mb-4">
              {email}
            </p>
            <p className="text-sm text-gray-500">
              Click the link in the email to verify your account.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleResend}
              disabled={isResending}
              variant="outline"
              className="w-full"
              size="lg"
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

            <Link to="/login" className="block">
              <Button variant="ghost" className="w-full" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-gray-700">
              <strong>💡 Tip:</strong> The verification link expires in 60
              minutes. If you don't see the email, check your spam folder.
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          © {new Date().getFullYear()} Pacific Ecommerce. All rights reserved.
        </p>
      </div>
    </div>
  );
}
