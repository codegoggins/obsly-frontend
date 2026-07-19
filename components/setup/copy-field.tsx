"use client";

import { useState } from "react";
import { CopyButton } from "@/components/ui/copy-button";

type CopyFieldProps = {
  label: string;
  value: string;
  secret?: boolean;
};

// labelled read-only value with copy, and reveal/hide for secrets
export function CopyField({ label, value, secret }: CopyFieldProps) {
  const [show, setShow] = useState(!secret);

  return (
    <div>
      <div className="mb-1.5 text-[0.75rem] font-medium text-muted-foreground">{label}</div>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2">
        <span className="flex-1 truncate font-mono text-[0.78125rem] text-foreground">
          {show ? value : "•".repeat(28)}
        </span>
        {secret && (
          <button
            onClick={() => setShow((s) => !s)}
            className="text-[0.6875rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {show ? "Hide" : "Reveal"}
          </button>
        )}
        <CopyButton text={value} />
      </div>
    </div>
  );
}
