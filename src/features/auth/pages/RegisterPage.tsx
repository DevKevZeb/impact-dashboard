import { RegisterForm } from "../components/RegisterForm";

export function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl font-bold text-white">P</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pacific Ecommerce
          </h1>
          <p className="text-gray-600">
            Program Management System
          </p>
        </div>

        <RegisterForm />

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700 text-center">
            <strong>ℹ️ Note:</strong> Your account will remain in{" "}
            <span className="font-semibold text-blue-700">pending</span> status until an
            administrator approves it.
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          © {new Date().getFullYear()} Pacific Ecommerce. All rights reserved.
        </p>
      </div>
    </div>
  );
}
