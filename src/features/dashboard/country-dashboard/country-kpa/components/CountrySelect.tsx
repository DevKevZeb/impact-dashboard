import { useState } from "react";
import { AsyncSearchSelect } from "@/shared/components/AsyncSearchSelect/AsyncSearchSelect";
import { useSearchCountries } from "@/features/country/hooks/country/useCountry";
import type { CountryOption } from "../types/CountryKpaType";
import type { FetchOptions } from "@/shared/components/AsyncSearchSelect/asyncSearch.type";

interface Props {
  value: CountryOption | null;
  onChange: (v: CountryOption | null) => void;
}

export function CountrySelect({ value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const { data } = useSearchCountries(query, page, limit);

  const fetchOptions: FetchOptions<CountryOption> = async ({query, page, limit}) => {
    setQuery(query);
    setPage(page);
    setLimit(limit);

    if (!data) return { items: [], hasMore: false };
    
    return {
      items: data.countries,
      hasMore: page < data.pagination.last_page,
    };
  };

  return (
    <AsyncSearchSelect<CountryOption> value={value} onChange={onChange} placeholder="Search country..." fetchOptions={fetchOptions} getOptionLabel={(c) => c.name} getOptionKey={(c) => c.id} />
  );
}
