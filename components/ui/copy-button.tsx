"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  text: string;
  label?: string;
  className?: string;
};

// copies text to the clipboard and flips to a check for a moment
export function CopyButton({ text, label, className }: CopyButtonProps) {
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setDone(true);
    window.setTimeout(() => setDone(false), 1400);
  };

  return (
    <button
      onClick={copy}
      className={cn(
        "ring-focus flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[0.6875rem] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        className,
      )}
    >
      {done ? <Check size={14} className="text-ok" /> : <Copy size={14} />}
      {label && <span>{done ? "Copied" : label}</span>}
    </button>
  );
}
