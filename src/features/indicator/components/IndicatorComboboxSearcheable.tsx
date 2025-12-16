import { useState, useEffect, useRef } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { useSearchIndicatorTypes } from "@/features/indicator-type/hooks/useIndicatorTypes";

interface IndicatorTypeOption {
  id: number;
  name: string;
}

interface Props {
  value: IndicatorTypeOption | null;
  onChange: (value: IndicatorTypeOption | null) => void;
  error?: string;
  label?: string;
}

export function IndicatorTypeComboboxSearchable({ value, onChange, error, label = "TYPE", }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading } = useSearchIndicatorTypes(search, page);
  const types: IndicatorTypeOption[] = data?.types ?? [];
  const lastPage = data?.pagination?.last_page ?? 1;

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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (value) {
      setInputValue(value.name);
    }
  }, [value]);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    setOpen(true);

    if (value && val !== value.name) {
      onChange(null);
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(val), 300);
  };

  useEffect(() => {
    if (!listRef.current || isLoading) return;

    const container = listRef.current;
    const items = container.querySelectorAll("[data-type-item]");
    const lastItem = items[items.length - 1] as Element | null;

    if (!lastItem || page >= lastPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    observer.observe(lastItem);
    return () => observer.disconnect();
  }, [types, isLoading, page, lastPage]);

  return (
    <div ref={wrapperRef} className="w-full space-y-1">
      {error ? (
        <p className="text-sm font-medium !text-rose-600">{error}</p>
      ) : (
        <label className="text-sm text-slate-600">{label}</label>
      )}

      <div className="relative">
        <Command>
          <CommandInput value={inputValue} placeholder="Search type..." onFocus={() => setOpen(true)} onValueChange={handleInputChange} className={error ? "border-rose-500 focus:ring-rose-500" : ""}/>
          {open && (
            <CommandList
              ref={listRef}
              className=" absolute left-0 top-full mt-1 w-full bg-white border rounded-md shadow-md max-h-56 overflow-auto z-50" >
              {isLoading && types.length === 0 && (
                <div className="p-2 text-xs text-gray-500">Loading...</div>
              )}

              {types.map((t) => (
                <CommandItem key={t.id} data-type-item className="cursor-pointer" onSelect={() => { onChange(t); setInputValue(t.name); setOpen(false); }} >
                  {t.name}
                </CommandItem>
              ))}

              {!isLoading && types.length === 0 && (
                <div className="p-2 text-xs text-gray-500">
                  No types found
                </div>
              )}

              {isLoading && types.length > 0 && (
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
