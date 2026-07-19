import { cn } from "@/lib/utils";

type SettingRowProps = {
  label: string;
  hint?: string;
  children?: React.ReactNode;
};

// label + hint on the left, control on the right; divider between rows
export function SettingRow({ label, hint, children }: SettingRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-3.5 last:border-0">
      <div className="min-w-0">
        <div className="text-[0.8125rem] font-medium">{label}</div>
        {hint && <div className="mt-0.5 text-[0.75rem] text-muted-foreground">{hint}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// gradient initials avatar used across members / account / org
export function Avatar({ initials, tone, size = 28 }: { initials: string; tone?: string; size?: number }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        tone ?? "bg-linear-to-br from-primary to-purple-500 text-white",
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}
