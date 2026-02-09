import { useEffect, useRef, useState } from "react";
import type { AsyncSearchSelectProps } from "./asyncSearch.type";
import { useAsyncSearch } from "./useAsyncSearch";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";

export function AsyncSearchSelect<T>({ value, onChange, fetchOptions, getOptionLabel, getOptionKey, placeholder = "Select an option", emptyMessage = "No results found", disable = false }: AsyncSearchSelectProps<T>) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

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

  const { options, loading, hasMore, loadMore } = useAsyncSearch( query, fetchOptions );

  const handleScroll = () => {
    if (!listRef.current || !hasMore || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 8) {
      loadMore();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="select-wrapper">
        <Input value={query} disabled={disable} placeholder={placeholder} className="input-default pr-10" onChange={(e) => { const newValue = e.target.value; setQuery(newValue); setOpen(true); if (value && newValue !== getOptionLabel(value)) onChange(null);}} onFocus={() => setOpen(true)} />
        <ChevronDown className={`select-icon-right transition-transform ${open ? "rotate-180" : ""}`}/>
      </div>

      {open && (
        <div ref={listRef} onScroll={handleScroll} className="select-dropdown" >
          {!loading && options.length === 0 && (
            <div className="select-empty">{emptyMessage}</div>
          )}

          {options.map((option) => 
            { const selected = value && getOptionKey(option) === getOptionKey(value);
            return (<div key={getOptionKey(option)} className={selected ? "select-option select-option-selected" : "select-option"} onClick={() => { onChange(option); setOpen(false); }} >
              {getOptionLabel(option)}
            </div>
          )})}

          {loading && (
            <div className="select-empty">Loading...</div>
          )}
        </div>
      )}
    </div>
  );
}
