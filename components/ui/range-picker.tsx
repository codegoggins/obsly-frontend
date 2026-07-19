"use client";

import { useState } from "react";
import { Clock, ChevronDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheck,
} from "@/components/ui/dropdown-menu";

const RANGES = ["Last 1h", "Last 24h", "Last 7d", "Last 30d"];

// self-contained time-range dropdown used across toolbars
export function RangePicker({ defaultValue = "Last 24h" }: { defaultValue?: string }) {
  const [range, setRange] = useState(defaultValue);

  return (
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
  );
}
