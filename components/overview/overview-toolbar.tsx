"use client";

import { Fragment, useState } from "react";
import { Clock, Filter, ChevronDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheck,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const RANGES = ["Last 1h", "Last 24h", "Last 7d", "Last 30d"];

const FILTER_GROUPS = [
  { label: "Environment", options: ["production", "staging"] },
  { label: "Level", options: ["error", "warning"] },
];

export function OverviewToolbar() {
  const [range, setRange] = useState("Last 24h");
  const [filters, setFilters] = useState<string[]>([]);

  const toggle = (key: string) =>
    setFilters((f) => (f.includes(key) ? f.filter((k) => k !== key) : [...f, key]));

  return (
    <div className="flex items-center gap-2">
      {/* time range — single select */}
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: "secondary", size: "lg" })}>
          <Clock size={14} /> {range} <ChevronDown size={13} className="text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {RANGES.map((r) => (
            <DropdownMenuCheck key={r} checked={r === range} onClick={() => setRange(r)}>
              {r}
            </DropdownMenuCheck>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* filters — multi select, stays open while toggling */}
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: "secondary", size: "lg" })}>
          <Filter size={14} /> Filters
          {filters.length > 0 && (
            <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] font-semibold text-primary-foreground">
              {filters.length}
            </span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[11rem]">
          {FILTER_GROUPS.map((group, gi) => (
            <Fragment key={group.label}>
              {gi > 0 && <DropdownMenuSeparator />}
              <DropdownMenuGroup>
                <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
                {group.options.map((opt) => (
                  <DropdownMenuCheck
                    key={opt}
                    checked={filters.includes(opt)}
                    closeOnClick={false}
                    onClick={() => toggle(opt)}
                    className="capitalize"
                  >
                    {opt}
                  </DropdownMenuCheck>
                ))}
              </DropdownMenuGroup>
            </Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
