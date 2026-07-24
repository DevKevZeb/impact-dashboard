import { useEffect, useRef, useState } from "react";

export type Option = {
  value: string;
  label: string;
};

interface SortSelectProps {
  options: Option[];
  value: string;
  onChange: (option: Option) => void;
  disabled?: boolean;
}

export default function SortSelect({
  options,
  value,
  onChange,
  disabled = false,
}: SortSelectProps) {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative">
      <div ref={ref} className={`select-default ${disabled ? "opacity-50 pointer-events-none" : ""}`} data-open={open ? "true" : "false"}>
        <button type="button" disabled={disabled} onClick={() => setOpen((o) => !o)} className="input-default input-select-default" >
          <span>{selected?.label}</span>
        </button>

        {open && (
          <ul className="select-menu">
            {options.map((opt) => (
              <li key={opt.value} onClick={() => { onChange(opt);  setOpen(false); }} className={`select-option ${ value === opt.value ? "select-option-active" : "" }`}>
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}