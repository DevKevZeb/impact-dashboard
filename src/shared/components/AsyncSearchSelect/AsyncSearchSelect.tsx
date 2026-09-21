import { useEffect, useRef, useState } from "react";
import type { AsyncSearchSelectProps } from "./asyncSearch.type";
import { useAsyncSearch } from "./useAsyncSearch";
import { useSyncOnChange } from "@/shared/hooks/useDidChange";
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

  useSyncOnChange(value, (v) => {
    if (v) {
      setQuery(getOptionLabel(v));
    } else {
      setQuery("");
    }
  });

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
    if (value && query === getOptionLabel(value)) {
      setQuery("");
    }
  };


  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Input value={query} disabled={disabled} placeholder={placeholder} onClick={handleOpen} onFocus={handleOpen} className="input-default pr-12 cursor-pointer"
          onChange={(e) => { const newValue = e.target.value; setQuery(newValue); setOpen(true); if (value && newValue !== getOptionLabel(value)) onChange(null); }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none">
          <div className="h-5 w-px bg-gray-300" />
          <svg className={`w-6 h-6 text-gray-600 transition-transform duration-200 ${open ? "rotate-180 text-blue-600" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {open && (
        <div ref={listRef} onScroll={handleScroll} className="absolute z-20 mt-2 w-full max-h-44 overflow-y-auto  rounded-md border border-gray-200  bg-white shadow-md" >
          {!loading && options.length === 0 && (
            <div className="p-3 text-gray-500 text-sm">
              {emptyMessage}
            </div>
          )}

          {options.map((option) => (
            <div key={getOptionKey(option)} className="px-4 py-2 text-sm cursor-pointer  hover:bg-blue-50 hover:text-blue-600  transition-colors" onClick={() => { onChange(option); setOpen(false); }} >
              {getOptionLabel(option)}
            </div>
          ))}

          {loading && (
            <div className="p-3 text-gray-500 text-sm">Loading...</div>
          )}
        </div>
      )}
    </div>

  );
}
