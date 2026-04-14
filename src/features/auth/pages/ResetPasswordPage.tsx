import { useNavigate, useSearchParams } from "react-router-dom";
import logoSrc from "@/assets/PEI ePulse Logo for WebApp.png";
import { Button } from "@/components/ui/button";
import { ResetPasswordForm } from "../components/ResetPasswordForm";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const isLinkValid = token.length > 0 && email.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logoSrc} alt="PEI ePulse Logo" className="mx-auto mb-4 h-40 w-auto" />
        </div>

        {isLinkValid ? (
          <ResetPasswordForm token={token} email={email} />
        ) : (
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
            <h1 className="mb-3 text-center text-2xl font-bold text-gray-900">
              Invalid reset link
            </h1>
            <p className="mb-6 text-center text-gray-600">
              The reset link is missing required information. Please request a new password reset email.
            </p>

            <Button className="w-full" size="lg" onClick={() => navigate("/forgot-password")}>
              Go to Forgot Password
            </Button>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Pacific Ecommerce. All rights reserved.
        </p>
      </div>
    </div>
  );
}