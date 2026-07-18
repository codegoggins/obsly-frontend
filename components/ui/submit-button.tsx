"use client";

import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

// full-width primary action button with a loading spinner
type SubmitButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  busy?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
};

export function SubmitButton({
  children,
  onClick,
  busy,
  disabled,
  type = "button",
  className,
}: SubmitButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || busy}
      className={cn(
        "ring-focus flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-70",
        className,
      )}
    >
      {busy ? <Spinner /> : children}
    </button>
  );
}
