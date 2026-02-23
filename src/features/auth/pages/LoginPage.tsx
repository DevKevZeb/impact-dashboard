import { LoginForm } from "../components/LoginForm";
import logoSrc from "@/assets/PEI ePulse Logo for WebApp.png";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logoSrc} alt="PEI ePulse Logo" className="mx-auto mb-4 h-40 w-auto"/>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-gray-500 mt-8">
          © {new Date().getFullYear()} Pacific Ecommerce. All rights reserved.
        </p>
      </div>
    </div>
  );
}
