import { useState } from 'react';
import { useActiveCountries } from '../hooks/useActiveCountries';
import { useCountryJoinRequests } from '../hooks/useCountryJoinRequests';
import { CountryCard } from './CountryCard';
import type { Country, JoinRequest } from '../types';
import { Input } from '@/components/ui/input';

export function ProjectManagerSection() {
  const { data: countriesResp, isLoading: loadingCountries } = useActiveCountries();
  const { data: requestsResp } = useCountryJoinRequests();
  const [search, setSearch] = useState('');

  const countries: Country[] = countriesResp?.data?.countries ?? [];
  const requests: JoinRequest[] = requestsResp?.data?.requests ?? [];

  const requestsByCountryId = new Map<number, JoinRequest>();

  requests.forEach((request) => {
    requestsByCountryId.set(request.country_id, request);
  });

  const filtered = countries.filter(
    (country: Country) =>
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      (country.currency?.code ?? '').toLowerCase().includes(search.toLowerCase())
  );

  if (loadingCountries) return <div>Loading countries...</div>;

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Countries</h2>
          <p className="text-sm text-muted-foreground">Active countries available to request access.</p>
        </div>
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by country or currency"
          className="md:max-w-xs"
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="py-3 pr-4 font-medium">Country</th>
              <th className="py-3 pr-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-8 text-center text-muted-foreground">
                  No active countries match your search.
                </td>
              </tr>
            ) : (
              filtered.map((country) => (
                <CountryCard
                  key={country.id}
                  country={country}
                  request={requestsByCountryId.get(country.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
