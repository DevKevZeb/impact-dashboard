import { useState } from "react";
import { AsyncSearchSelect } from "@/shared/components/AsyncSearchSelect/AsyncSearchSelect";
import { useSearchKpas } from "@/features/kpa/hooks/useKpas";
import type { KpaOption } from "../types/CountryKpaType";
import type { FetchOptions } from "@/shared/components/AsyncSearchSelect/asyncSearch.type";
import { fetchKpasForSelect } from "@/features/kpa/services/kpa.api";

interface Props {
  value: KpaOption | null;
  onChange: (v: KpaOption | null) => void;
}

export function KpaSelect({ value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const { data } = useSearchKpas(query, page, limit);


  return (
    <AsyncSearchSelect<KpaOption> value={value} onChange={onChange} placeholder="Search KPA..." fetchOptions={fetchKpasForSelect} getOptionLabel={(k) => k.name} getOptionKey={(k) => k.id} />
  );
}
