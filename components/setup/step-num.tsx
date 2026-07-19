import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// numbered step marker; shows a check once the step is done
export function StepNum({ n, done }: { n: number; done?: boolean }) {
  return (
    <span
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.75rem] font-semibold",
        done ? "bg-ok/15 text-ok" : "bg-primary/15 text-primary",
      )}
    >
      {done ? <Check size={13} /> : n}
    </span>
  );
}
