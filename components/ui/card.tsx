import { cn } from "@/lib/utils";

// bordered surface used across the app; optional brand glow for hero/AI cards
type CardProps = React.ComponentProps<"div"> & { glow?: boolean };

export function Card({ className, glow, children, ...props }: CardProps) {
  const base = "rounded-lg border border-border bg-card text-card-foreground";

  if (glow) {
    return (
      <div className={cn(base, "relative overflow-hidden", className)} {...props}>
        <div className="brand-glow pointer-events-none absolute inset-0" />
        <div className="relative">{children}</div>
      </div>
    );
  }

  return (
    <div className={cn(base, className)} {...props}>
      {children}
    </div>
  );
}
