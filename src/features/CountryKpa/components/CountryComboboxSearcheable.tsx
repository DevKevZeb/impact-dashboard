import { useState, useEffect, useRef } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { useSearchCountries } from "@/features/country/hooks/country/useCountry";

interface CountryOption {
  id: number;
  name: string;
}

interface Props {
  value: CountryOption | null;
  onChange: (value: CountryOption | null) => void;
  error?: string;
  label?: string;
}

export function CountryComboboxSearchable({ value, onChange, error, label = "Country", }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading } = useSearchCountries(search, page);
  const countries: CountryOption[] = data?.countries ?? [];
  const lastPage: number = data?.pagination?.last_page ?? 1;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (value) {
      setInputValue(value.name);
    }
  }, [value]);

  const handleSearch = (val: string) => {
    setInputValue(val);
    setOpen(true);

    if (value && val !== value.name) {
      onChange(null);
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(val), 300);
  };

  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollTop + clientHeight >= scrollHeight - 5 && page < lastPage && !isLoading) {
      setPage((p) => p + 1);
    }
  };

  return (
    <div ref={wrapperRef} className="w-full space-y-1">
      <div className="relative">
        <Command>
          <CommandInput value={inputValue} placeholder="Search country..." onFocus={() => setOpen(true)} onValueChange={handleSearch} className={error ? "border-rose-500 focus:ring-rose-500" : ""} />
          {open && (
            <CommandList ref={listRef} onScroll={handleScroll} className=" absolute left-0 top-full mt-1 w-full max-h-56 bg-white border shadow-lg overflow-auto z-50 rounded-md " >
              {isLoading && countries.length === 0 && (
                <div className="p-2 text-xs text-gray-500">Loading...</div>
              )}

              {countries.map((c) => (
                <CommandItem key={c.id} value={c.name} onSelect={() => { onChange(c); setInputValue(c.name); setOpen(false); }} >
                  {c.name}
                </CommandItem>
              ))}

              {!isLoading && countries.length === 0 && (
                <div className="p-2 text-xs text-gray-500">
                  No countries found
                </div>
              )}

              {isLoading && countries.length > 0 && (
                <div className="p-2 text-xs text-gray-500 text-center">
                  Loading more...
                </div>
              )}
            </CommandList>
          )}
        </Command>
      </div>
    </div>
  );
}
