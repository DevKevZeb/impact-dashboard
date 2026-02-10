import { AsyncSearchSelect } from "@/shared/components/AsyncSearchSelect/AsyncSearchSelect";
import type { KpaOption } from "../types/CountryKpaType";
import { fetchKpasForSelect } from "@/features/kpa/services/kpa.api";

interface Props {
  value: KpaOption | null;
  onChange: (v: KpaOption | null) => void;
}

export function KpaSelect({ value, onChange }: Props) {
  return (
    <AsyncSearchSelect<KpaOption> value={value} onChange={onChange} placeholder="Search KPA..." fetchOptions={fetchKpasForSelect} getOptionLabel={(k) => k.name} getOptionKey={(k) => k.id} />
  );
}
