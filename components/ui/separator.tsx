import { cn } from "@/lib/utils";

// thin divider line, horizontal or vertical
type SeparatorProps = {
  orientation?: "horizontal" | "vertical";
  className?: string;
};

export function Separator({ orientation = "horizontal", className }: SeparatorProps) {
  return (
    <span
      className={cn(
        "block shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
    />
  );
}
