"use client";

import { cn } from "@/lib/utils";

const LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];
const TONES = ["bg-muted-foreground/30", "bg-danger", "bg-warn", "bg-primary", "bg-ok"];

export function scorePassword(value: string): number {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return score;
}

export function PasswordStrength({ value }: { value: string }) {
  if (!value) return null;
  const score = scorePassword(value);
  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="flex flex-1 gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i < score ? TONES[score] : "bg-muted",
            )}
          />
        ))}
      </div>
      <span className="w-16 text-right text-[0.6875rem] text-muted-foreground">{LABELS[score]}</span>
    </div>
  );
}
