"use client";

import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

// outlined button with a provider logo — used for social login and GitHub connect
type ProviderButtonProps = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  busy?: boolean;
  disabled?: boolean;
  className?: string;
};

export function ProviderButton({
  icon,
  label,
  onClick,
  busy,
  disabled,
  className,
}: ProviderButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || busy}
      className={cn(
        "ring-focus flex h-11 items-center justify-center gap-2.5 rounded-lg border border-border bg-card text-[0.84375rem] font-medium transition-colors hover:bg-accent disabled:opacity-60",
        className,
      )}
    >
      {busy ? <Spinner /> : icon}
      {label}
    </button>
  );
}
