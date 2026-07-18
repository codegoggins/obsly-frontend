"use client";

import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

// reusable labeled select with optional icon and error
type SelectFieldProps = React.ComponentProps<"select"> & {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  placeholder?: string;
  options: Option[];
  containerClassName?: string;
};

export function SelectField({
  label,
  icon: Icon,
  error,
  placeholder,
  options,
  className,
  containerClassName,
  value,
  ...props
}: SelectFieldProps) {
  return (
    <label className="block">
      {label && (
        <div className="mb-1.5 text-[0.78125rem] font-medium text-foreground/85">{label}</div>
      )}
      <div
        className={cn(
          "flex h-11 items-center gap-2.5 rounded-lg border bg-card px-3 transition focus-within:ring-2",
          error
            ? "border-danger/50 focus-within:border-danger focus-within:ring-danger/20"
            : "border-border focus-within:border-primary/40 focus-within:ring-ring/30",
          containerClassName,
        )}
      >
        {Icon && <Icon size={16} className="shrink-0 text-muted-foreground" />}
        <select
          value={value}
          className={cn(
            "h-full w-full appearance-none bg-transparent text-sm outline-none",
            value ? "text-foreground" : "text-muted-foreground/60",
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value} className="text-foreground">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none shrink-0 text-muted-foreground" />
      </div>
      {error && <div className="mt-1.5 text-[0.71875rem] text-danger">{error}</div>}
    </label>
  );
}
