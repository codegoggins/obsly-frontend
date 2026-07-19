"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { format, parseISO, subDays, startOfMonth, startOfYear } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// fixed "now" so the relative presets line up with the mock 2026 data
const TODAY = new Date(2026, 6, 19);

const PRESETS: { label: string; range: () => DateRange }[] = [
  { label: "Last 24 hours", range: () => ({ from: TODAY, to: TODAY }) },
  { label: "Last 7 days", range: () => ({ from: subDays(TODAY, 6), to: TODAY }) },
  { label: "Last 30 days", range: () => ({ from: subDays(TODAY, 29), to: TODAY }) },
  { label: "This month", range: () => ({ from: startOfMonth(TODAY), to: TODAY }) },
  { label: "This year", range: () => ({ from: startOfYear(TODAY), to: TODAY }) },
];

const iso = (d: Date) => format(d, "yyyy-MM-dd");
const pretty = (d: Date) => format(d, "MMM d, yyyy");

function labelFor(from: string | null, to: string | null) {
  if (!from) return "All dates";
  const f = parseISO(from);
  if (!to || from === to) return pretty(f);
  return `${format(f, "MMM d")} – ${pretty(parseISO(to))}`;
}

type DateRangeFilterProps = {
  from: string | null;
  to: string | null;
  onChange: (range: { from: string; to: string } | null) => void;
};

export function DateRangeFilter({ from, to, onChange }: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>();

  // seed the draft from the committed value when the popover opens (no effect)
  const handleOpen = (o: boolean) => {
    if (o) setDraft(from ? { from: parseISO(from), to: parseISO(to ?? from) } : undefined);
    setOpen(o);
  };

  const apply = () => {
    if (draft?.from) onChange({ from: iso(draft.from), to: iso(draft.to ?? draft.from) });
    setOpen(false);
  };
  const clear = () => {
    onChange(null);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger className={cn(buttonVariants({ variant: "secondary", size: "lg" }), from && "border-primary/40 text-foreground")}>
        <CalendarDays size={14} /> {labelFor(from, to)} <ChevronDown size={13} className="text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="end" className="flex w-auto p-0">
        <div className="flex w-40 shrink-0 flex-col gap-0.5 border-r border-border p-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setDraft(p.range())}
              className="rounded-md px-2.5 py-1.5 text-left text-[0.8125rem] text-foreground/85 transition-colors hover:bg-accent"
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={clear}
            className="mt-1 rounded-md px-2.5 py-1.5 text-left text-[0.8125rem] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            All dates
          </button>
        </div>

        <div className="p-2">
          <Calendar mode="range" selected={draft} onSelect={setDraft} defaultMonth={draft?.from ?? TODAY} />
          <div className="mt-1 flex items-center justify-between gap-2 border-t border-border px-1 pt-2">
            <span className="text-[0.71875rem] text-muted-foreground">
              {draft?.from ? labelFor(iso(draft.from), iso(draft.to ?? draft.from)) : "Pick a date or range"}
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" disabled={!draft?.from} onClick={apply}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
