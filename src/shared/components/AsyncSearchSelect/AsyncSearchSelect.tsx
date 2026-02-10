import { useEffect, useRef, useState } from "react";
import type { AsyncSearchSelectProps } from "./asyncSearch.type";
import { useAsyncSearch } from "./useAsyncSearch";
import { Input } from "@/components/ui/input";

export function AsyncSearchSelect<T>({ value, onChange, fetchOptions, getOptionLabel, getOptionKey, placeholder = "Select an option", emptyMessage = "No results found", enab = false, disabled = false }: AsyncSearchSelectProps<T>) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(enab);

  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) { if (containerRef.current &&!containerRef.current.contains(event.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      setQuery(getOptionLabel(value));
    } else {
      setQuery("");
    }
  }, [value, getOptionLabel]);

  const { options, loading, hasMore, loadMore } = useAsyncSearch( query, fetchOptions, getOptionKey, getOptionLabel, enabled );

  const handleScroll = () => {
    if (!listRef.current || !hasMore || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 8) {
      loadMore();
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setEnabled(true);
  };


  return (
    <div ref={containerRef} className="relative w-full">
      <Input value={query} disabled={disabled} placeholder={placeholder} onClick={handleOpen} className="input-default" onChange={(e) => { const newValue = e.target.value; setQuery(newValue); setOpen(true); if (value && newValue !== getOptionLabel(value)) onChange(null);}} onFocus={handleOpen} />

      {open && (
        <div ref={listRef} onScroll={handleScroll} className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto border bg-white" >
          {!loading && options.length === 0 && (
            <div className="p-2 text-sm text-gray-500">
              {emptyMessage}
            </div>
          )}

          {options.map((option) => (
            <div key={getOptionKey(option)} className="cursor-pointer p-2 hover:bg-gray-100" onClick={() => { onChange(option); setOpen(false); }} >
              {getOptionLabel(option)}
            </div>
          ))}

          {loading && (
            <div className="p-2 text-sm text-gray-500">Loading...</div>
          )}
        </div>
      )}
    </div>
  );
}
