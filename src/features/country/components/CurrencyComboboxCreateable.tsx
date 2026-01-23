import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";

interface CurrencyOption {
  id?: number;
  code: string;
}

interface Props {
  options: CurrencyOption[];
  value?: string | { id?: number; code: string } | null;
  onChange: (v: string | { id?: number; code: string } | null) => void;
  placeholder?: string;
}

export function CurrencyComboboxCreateable({ options, value, onChange, placeholder = "Write or select" }: Props) {
  const [open, setOpen] = useState(false);
  const displayValue: string = typeof value === "string" ? value : value?.code ? value.code : "";

  const handleSelect = (opt: CurrencyOption) => {
    if (opt.id != null) {
      onChange({ id: opt.id, code: opt.code });
    } else {
      onChange({ code: opt.code });
    }
    setOpen(false);
  };

  const handleFreeValue = () => {
    const trimmed = displayValue.trim();
    if (trimmed.length === 0) return;
    onChange({ code: trimmed });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className={cn( "w-full justify-between flex border rounded-lg px-3 py-2 text-left", "bg-background cursor-text" )} onClick={() => setOpen(true)} >
          {displayValue || placeholder}
          <ChevronsUpDown className="size-4 opacity-50" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} value={displayValue} onValueChange={(text) => onChange({ code: text })} />
          <CommandList className="max-h-[200px] overflow-y-auto" onWheelCapture={(e) => {e.stopPropagation();}}>
            <CommandEmpty>
              <button className="w-full text-left text-sm px-3 py-2 text-emerald-600 hover:bg-muted" onClick={handleFreeValue} >
                Use “{displayValue}” like new currency
              </button>
            </CommandEmpty>

            <CommandGroup heading="Existing currencies">
              {options.map((opt) => (
                <CommandItem
                  key={opt.id}
                  onSelect={() => handleSelect(opt)}
                >
                  {opt.code}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
