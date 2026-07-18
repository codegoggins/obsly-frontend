"use client";

import { useState } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// reusable labeled input with optional icon, password toggle, hint, and error
type InputFieldProps = React.ComponentProps<"input"> & {
  label?: string;
  icon?: LucideIcon;
  right?: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  containerClassName?: string;
};

export function InputField({
  label,
  icon: Icon,
  right,
  hint,
  error,
  type = "text",
  className,
  containerClassName,
  ...props
}: InputFieldProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && show ? "text" : type;

  return (
    <label className="block">
      {(label || right) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && <span className="text-[0.78125rem] font-medium text-foreground/85">{label}</span>}
          {right}
        </div>
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
        <input
          type={inputType}
          className={cn(
            "h-full w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60",
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error ? (
        <div className="mt-1.5 text-[0.71875rem] text-danger">{error}</div>
      ) : hint ? (
        <div className="mt-1.5 text-[0.71875rem] text-muted-foreground">{hint}</div>
      ) : null}
    </label>
  );
}
