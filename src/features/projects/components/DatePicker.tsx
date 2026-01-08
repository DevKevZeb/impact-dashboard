"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"

type Calendar28Props = {
  value: Date | null
  onChange: (date: Date | null) => void
}

function formatDate(date: Date | null) {
  return date
    ? date.toLocaleDateString("en-US", 
    { day: "2-digit", month: "long", year: "numeric", })
    : ""
}

export function Calendar28({ value, onChange }: Calendar28Props) {
  const [open, setOpen] = React.useState(false)

  return (

    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input value={formatDate(value)} placeholder="Select date" readOnly className="bg-background pr-10 input-default"  onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); }}}/>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button type="button" id="date-picker" variant="ghost" className="absolute top-1/2 right-1 size-6  btn-tertiary -translate-y-1/2" >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
            <Calendar mode="single" selected={value ?? undefined} captionLayout="dropdown" onSelect={(date) => { onChange(date ?? null); setOpen(false)}} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
