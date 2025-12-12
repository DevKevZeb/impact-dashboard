import { useState, useEffect, useRef } from "react";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { useSearchKpas } from "@/features/kpa/hooks/useKpas";

interface KpaOption {
  id: number;
  name: string;
}

interface Props {
  value: KpaOption | null;
  onChange: (value: KpaOption) => void;
}

export function KpaComboboxSearchable({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);

  const listRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading } = useSearchKpas(search, page);
  const kpas: KpaOption[] = data?.kpas ?? [];
  const lastPage = data?.pagination?.last_page ?? 1;

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (value) setInputValue(value.name);
  }, [value]);

  const handleInputChange = (val: string) => {
    setInputValue(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(val), 300);
  };

  useEffect(() => {
    if (!listRef.current || isLoading) return;

    const container = listRef.current;
    const items = container.querySelectorAll("[data-kpa-item]");
    const lastItem = items[items.length - 1] as Element | null;

    if (!lastItem || page >= lastPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    observer.observe(lastItem);
    return () => observer.disconnect();
  }, [kpas, isLoading, page, lastPage]);

  return (
    <div className="w-full relative">
      <Command>
        <CommandInput
          value={inputValue}
          placeholder="Search KPA..."
          onFocus={() => setOpen(true)}
          onValueChange={handleInputChange}
        />

        {open && (
          <CommandList
            ref={listRef}
            className="absolute left-0 top-full mt-1 w-full bg-white border rounded-md shadow-md max-h-56 overflow-auto z-50"
          >
            {isLoading && kpas.length === 0 && (
              <div className="p-2 text-xs text-gray-500">Loading...</div>
            )}

            {kpas.map((k) => (
              <CommandItem key={k.id} data-kpa-item className="cursor-pointer" onSelect={() => { onChange(k); setInputValue(k.name); setOpen(false); }} >
                {k.name}
              </CommandItem>
            ))}

            {!isLoading && kpas.length === 0 && (
              <div className="p-2 text-xs text-gray-500">No KPAs found</div>
            )}

            {isLoading && kpas.length > 0 && (
              <div className="p-2 text-xs text-gray-500 text-center">Loading more...</div>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}
