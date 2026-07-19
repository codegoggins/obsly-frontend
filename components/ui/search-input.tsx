"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchInputProps = React.ComponentProps<"input">;

// icon + input row for toolbar-style search fields
export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div className="flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 transition focus-within:ring-2 focus-within:ring-ring/40">
      <Search size={15} className="shrink-0 text-muted-foreground" />
      <input
        className={cn("h-full w-full bg-transparent text-[0.8125rem] outline-none placeholder:text-muted-foreground/70", className)}
        {...props}
      />
    </div>
  );
}
