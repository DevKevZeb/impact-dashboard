import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, X, ArrowRight } from "lucide-react";
import { useCountryStatus } from "@/features/country/hooks/useCountryStatus";

export function CountryStatusBanner() {
  const { isActive, hasCountry, isCountryManager, isProjectManager, countryId, countryName } =
    useCountryStatus();
  const [dismissed, setDismissed] = useState(false);

  if (isActive || !hasCountry || dismissed) return null;

  const country = countryName ?? "your country";

  return (
    <div
      role="status"
      aria-live="polite"
      className="border-b border-amber-200 bg-amber-50 text-amber-900"
    >
      <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-3 sm:px-6">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden="true" />

        <div className="flex-1 text-sm">
          {isCountryManager ? (
            <p>
              <span className="font-semibold">{country} is not active yet.</span>{" "}
              Add your Strategic Outputs, Measures and Indicators, then click{" "}
              <span className="font-medium">“Confirm Dashboard”</span> to activate it. Project
              Managers can only create programs and projects once the dashboard is confirmed.
            </p>
          ) : isProjectManager ? (
            <p>
              <span className="font-semibold">{country} has not been activated yet.</span>{" "}
              The Country Manager needs to confirm the dashboard before you can create programs
              or projects.
            </p>
          ) : (
            <p>
              <span className="font-semibold">{country} is not active yet.</span>{" "}
              The Country Manager needs to confirm the dashboard to enable programs and projects.
            </p>
          )}

          {isCountryManager && countryId != null && (
            <Link
              to={`/app/country-kpa/${countryId}`}
              className="mt-1 inline-flex items-center gap-1 font-medium text-amber-800 underline-offset-2 hover:text-amber-900 hover:underline"
            >
              Go to dashboard
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss notification"
          className="rounded-md p-1 text-amber-500 transition-colors hover:bg-amber-100 hover:text-amber-700"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
