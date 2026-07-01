import { Navigate } from 'react-router-dom';
import { Loader2, Globe } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useCountryStatus } from '@/features/country/hooks/useCountryStatus';
import { useActiveCountries } from '../hooks/useActiveCountries';
import { useCountryJoinRequests } from '../hooks/useCountryJoinRequests';
import { CountryCard } from '../components/CountryCard';
import { EmptyState } from '@/shared/components/EmptyState';
import {
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableHeader,
} from "@/shared/components/table";
import type { Country, JoinRequest } from '../types';

export function CountriesPage() {
  const user = useAuthStore((state) => state.user);
  const isProjectManager = (user?.roles ?? []).some((r) => r.name === 'project-manager');
  const { isActive: isCountryActive } = useCountryStatus();

  const { data: countriesResp, isLoading: loadingCountries } = useActiveCountries();
  const { data: requestsResp } = useCountryJoinRequests();

  const countries: Country[] = countriesResp?.data?.countries ?? [];
  const requests: JoinRequest[] = requestsResp?.data?.requests ?? [];

  const requestsByCountryId = new Map<number, JoinRequest>();
  requests.forEach((request) => {
    requestsByCountryId.set(request.country_id, request);
  });

  if (!isProjectManager) {
    return <Navigate to="/app" replace />;
  }

  if (loadingCountries) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="loader-default" />
          <p className="text-gray-500">Loading countries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="page-title">Countries</h1>
        <p className="mt-2 text-gray-500">
          Active countries available to request access.
        </p>
      </div>

      {countries.length === 0 ? (
        <EmptyState
          icon={Globe}
          title="No active countries"
          description="No active countries available at this time"
        />
      ) : (
        <DataTable>
          <DataTableHeader>
            <tr>
              <DataTableHead className="min-w-[220px]">Country</DataTableHead>
              <DataTableHead className="min-w-[180px]">Actions</DataTableHead>
            </tr>
          </DataTableHeader>
          <DataTableBody>
            {countries.map((country) => (
              <CountryCard
                key={country.id}
                country={country}
                request={requestsByCountryId.get(country.id)}
                canJoin={isCountryActive}
              />
            ))}
          </DataTableBody>
        </DataTable>
      )}
    </div>
  );
}
