import { Separator } from "@/components/ui/separator";

// labelled divider: line — text — line
export function OrDivider({ label = "or continue with email" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <Separator className="flex-1" />
      <span className="text-[0.71875rem] font-medium uppercase tracking-wider text-muted-foreground/70">
        {label}
      </span>
      <Separator className="flex-1" />
    </div>
  );
}
