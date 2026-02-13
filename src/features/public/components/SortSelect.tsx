import { useEffect, useRef, useState } from "react";

type Option = {
  value: string;
  label: string;
};

const OPTIONS: Option[] = [
  { value: "date_newest", label: "Date Newest" },
  { value: "date_oldest", label: "Date Oldest" },
  { value: "name_za", label: "Name Z–A" },
  { value: "name_az", label: "Name A–Z" },
];

export default function SortSelect() {
    const [open, setOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<Option>(OPTIONS[0]);

    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

  return (
    <div className="relative">
        <div ref={ref} className="select-default" data-open={open ? "true" : "false"}>
            <button type="button" onClick={() => setOpen((o) => !o)} className="input-default input-select-default" >
                <span>{selected.label}</span>
            </button>

            {open && (
                <ul className="select-menu">
                {OPTIONS.map((opt) => (
                    <li key={opt.value} onClick={() => {setSelected(opt); setOpen(false);}} className={`select-option ${selected.value === opt.value ? "select-option-active" : ""}`}>
                    {opt.label}
                    </li>
                ))}
                </ul>
            )}
        </div>
    </div>
  );
}
