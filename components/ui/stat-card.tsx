import { ArrowUp, ArrowDown, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Sparkline } from "@/components/sparkline";
import { cn } from "@/lib/utils";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  delta: number;
  deltaGood?: boolean; // override: is an increase good? defaults to "down is good"
  sub?: string;
  tone?: "brand" | "danger" | "warn" | "ok";
  spark: number[];
};

export function StatCard({ icon: Icon, label, value, delta, deltaGood, sub, tone = "brand", spark }: StatCardProps) {
  const up = delta > 0;
  const good = deltaGood ?? !up;
  const isPercent = Number.isInteger(delta);

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-[0.75rem] font-medium text-muted-foreground">
          <Icon size={14} /> {label}
        </div>
        <span
          className={cn(
            "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[0.6875rem] font-medium",
            good ? "bg-ok/12 text-ok" : "bg-danger/12 text-danger",
          )}
        >
          {up ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
          {Math.abs(delta)}
          {isPercent && "%"}
        </span>
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div>
          <div className="font-mono text-[1.625rem] font-semibold leading-none tracking-tight">{value}</div>
          {sub && <div className="mt-1.5 text-[0.6875rem] text-muted-foreground">{sub}</div>}
        </div>
        <Sparkline data={spark} tone={tone} w={90} h={34} />
      </div>
    </Card>
  );
}
