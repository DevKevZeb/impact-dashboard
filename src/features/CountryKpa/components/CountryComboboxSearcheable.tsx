import { useState, useEffect, useRef } from "react";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { useSearchCountries } from "@/features/country/hooks/country/useCountry";

interface CountryOption {
  id: number;
  name: string;
}

interface Props {
  value: CountryOption | null;
  onChange: (value: CountryOption) => void;
}

export function CountryComboboxSearchable({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const listRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading } = useSearchCountries(search, page);
  const countries: CountryOption[] = data?.countries ?? [];
  const lastPage: number = data?.pagination?.last_page ?? 1;

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleSearch = (val: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(val), 300);
  };

  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const bottomReached = scrollTop + clientHeight >= scrollHeight - 5;

    if (bottomReached && page < lastPage && !isLoading) {
      setPage((p) => p + 1);
    }
  };

  return (
    <div className="w-full relative">
      <Command>
        <CommandInput
          placeholder={value ? value.name : "Search country..."}
          onFocus={() => setOpen(true)}
          onValueChange={handleSearch}
        />

        {open && (
          <CommandList
            ref={listRef}
            onScroll={handleScroll}
            className="absolute left-0 top-full mt-1 w-full max-h-56 bg-white border shadow-md overflow-auto z-50"
          >
            {isLoading && countries.length === 0 && (
              <div className="p-2 text-xs text-gray-500">Loading...</div>
            )}

            {countries.map(c => (
              <CommandItem
                key={c.id}
                onSelect={() => { onChange(c); setOpen(false); }}
              >
                {c.name}
              </CommandItem>
            ))}

            {!isLoading && countries.length === 0 && (
              <div className="p-2 text-xs text-gray-500">No countries found</div>
            )}

            {isLoading && countries.length > 0 && (
              <div className="p-2 text-xs text-gray-500 text-center">Loading more...</div>
            )}
          </CommandList>
        )}

      </Command>
    </div>
  );
}
