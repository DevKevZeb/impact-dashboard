import { useState, useEffect, useRef, useMemo } from "react";
import { useSyncOnChange } from "@/shared/hooks/useDidChange";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { useSearchKpas } from "@/features/kpa/hooks/useKpas";

interface KpaOption {
  id: number;
  name: string;
}

interface Props {
  value: KpaOption | null;
  onChange: (value: KpaOption | null) => void;
  error?: string;
  label?: string;
}

export function KpaComboboxSearchable({ value, onChange, error }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading } = useSearchKpas(search, page, 10);
  const kpas: KpaOption[] = useMemo(() => data?.kpas ?? [], [data]);
  const lastPage = data?.pagination?.last_page ?? 1;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current &&!wrapperRef.current.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useSyncOnChange(search, () => setPage(1));

  useSyncOnChange(value, (v) => {
    if (v) setInputValue(v.name);
  });

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
    },{ root: container, threshold: 1.0 });

    observer.observe(lastItem);
    return () => observer.disconnect();
  }, [kpas, isLoading, page, lastPage]);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    setOpen(true);

    if (value && val !== value.name) onChange(null);
  
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(val), 300);
  };

  return (
    <div ref={wrapperRef} className="w-full space-y-1">
      <div className="relative">
        <Command>
          <CommandInput value={inputValue} placeholder="Search KPA..." onFocus={() => setOpen(true)} onValueChange={handleInputChange} className={error ? "border-rose-500 focus:ring-rose-500" : ""} />
          {open && 
            <CommandList ref={listRef} className="absolute left-0 top-full mt-1 w-full bg-white border rounded-md shadow-md max-h-[200px] overflow-auto z-50" >
              {isLoading && kpas.length === 0 && (
                <div className="p-2 text-xs text-gray-500">Loading...</div>
              )}

              {kpas.map((k) => (
                <CommandItem key={k.id} data-kpa-item className="cursor-pointer" onSelect={() => { onChange(k); setInputValue(k.name); setOpen(false); }} >
                  {k.name}
                </CommandItem>
              ))}

              {!isLoading && kpas.length === 0 && (
                <div className="p-2 text-xs text-gray-500">
                  No KPAs found
                </div>
              )}

              {isLoading && kpas.length > 0 && (
                <div className="p-2 text-xs text-gray-500 text-center">
                  Loading more...
                </div>
              )}
            </CommandList>
          }
        </Command>
      </div>
    </div>
  );
}
