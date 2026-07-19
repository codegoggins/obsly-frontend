import { cn } from "@/lib/utils";

// small status pill used across issues, metrics, and headers
const TONE = {
  muted: "bg-muted text-muted-foreground border-transparent",
  outline: "bg-transparent text-foreground/70 border-border",
  error: "bg-danger/12 text-danger border-danger/20",
  warn: "bg-warn/14 text-warn border-warn/25",
  ok: "bg-ok/14 text-ok border-ok/25",
  brand: "bg-primary/14 text-primary border-primary/25",
};

type BadgeProps = React.ComponentProps<"span"> & {
  tone?: keyof typeof TONE;
  dot?: boolean;
};

export function Badge({ tone = "muted", dot, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[0.6875rem] font-medium leading-none",
        TONE[tone],
        className,
      )}
      {...props}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
