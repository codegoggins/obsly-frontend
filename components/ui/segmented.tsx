"use client";

import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

type SegmentedProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

// compact pill toggle for mutually-exclusive filters (status, tabs)
export function Segmented({ options, value, onChange, className }: SegmentedProps) {
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1", className)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-md px-3 py-1 text-[0.78125rem] font-medium transition-colors",
            value === opt.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
