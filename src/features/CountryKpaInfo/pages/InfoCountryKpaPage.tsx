import { useParams, useLocation } from "react-router-dom";

interface CountryOption {
  id: number;
  name: string;
}

export default function InfoCountryKpaPage() {
  const { countryId } = useParams();
  const { state } = useLocation();

  const country = state?.country as CountryOption | undefined;

  console.log("Country recibido:", country);

  return (
    <div className="p-6 space-y-4">
      <h1 className="label-default">KPAs of "{country?.name ?? `Country ${countryId}`}"</h1>
    </div>
  );
}
