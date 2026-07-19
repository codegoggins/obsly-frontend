import { ArrowUp, ArrowDown, TrendingUp, Dot, Clock, Sparkles, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricChart } from "@/components/ui/metric-chart";
import { cn } from "@/lib/utils";
import { fmtMs, fmtBigNum, X_24H_FULL, type Metric, type MetricType } from "@/lib/mock/metrics";

const TYPE_META: Record<MetricType, { tone: "brand" | "ok" | "warn"; icon: LucideIcon }> = {
  counter: { tone: "brand", icon: TrendingUp },
  gauge: { tone: "ok", icon: Dot },
  timing: { tone: "warn", icon: Clock },
};

const PCTS = [
  { key: "p50", tone: "ok" },
  { key: "p95", tone: "warn" },
  { key: "p99", tone: "danger" },
] as const;

function Delta({ value, good }: { value: number; good: "up" | "down" }) {
  if (value === 0) return <span className="text-[0.75rem] text-muted-foreground">no change</span>;
  const up = value > 0;
  const isGood = good === "up" ? up : !up;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-[0.78125rem] font-medium", isGood ? "text-ok" : "text-danger")}>
      {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
      {Math.abs(value)}%<span className="ml-1 font-normal text-muted-foreground">vs prev</span>
    </span>
  );
}

type MetricCardProps = {
  metric: Metric;
  onExplain: (m: Metric) => void;
};

export function MetricCard({ metric: m, onExplain }: MetricCardProps) {
  const type = TYPE_META[m.type];
  const TypeIcon = type.icon;
  const hasAnom = m.anomalies.length > 0;

  const displayVal = m.type === "timing" ? fmtMs(m.value) : m.fmtBig ? fmtBigNum(m.value) : m.value.toLocaleString();
  const valUnit = m.type === "timing" ? "" : m.unit;
  // chart tooltip formatter, carrying the unit (%/MB) so gauges read correctly
  const fmt = m.type === "timing" ? fmtMs : m.fmtBig ? fmtBigNum : (v: number) => Math.round(v).toLocaleString() + m.unit;

  return (
    <Card className={cn("flex flex-col p-4", m.featured && "sm:col-span-2")}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.84375rem] font-semibold text-foreground">{m.name}</span>
          <Badge tone={type.tone} className="font-mono">
            <TypeIcon size={10} /> {m.type}
          </Badge>
          {hasAnom && (
            <Badge tone="warn">
              <Sparkles size={10} /> anomaly
            </Badge>
          )}
        </div>
      </div>

      <div className="mt-2 flex items-end gap-3">
        <div className="font-mono text-[1.75rem] font-semibold leading-none tracking-tight">
          {displayVal}
          {valUnit && <span className="ml-0.5 text-[0.9375rem] text-muted-foreground">{valUnit}</span>}
        </div>
        <div className="pb-0.5">
          <Delta value={m.delta} good={m.good} />
        </div>
      </div>

      {/* percentile chips for timings */}
      {m.type === "timing" && m.p && (
        <div className="mt-3 flex gap-2">
          {PCTS.map(({ key, tone }) => (
            <div key={key} className="flex flex-1 items-center justify-between rounded-md border border-border bg-muted/40 px-2.5 py-1.5">
              <span className="flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
                <span className="h-0.75 w-3 rounded-full" style={{ background: `hsl(var(--${tone}))` }} />
                {key}
              </span>
              <span className="font-mono text-[0.78125rem] font-semibold">{fmtMs(m.p![key])}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3.5 flex-1">
        <MetricChart
          series={m.series}
          anomalies={m.anomalies}
          xlabels={X_24H_FULL}
          legend={m.type === "timing"}
          height={m.featured ? 210 : 132}
          fmt={fmt}
        />
      </div>

      {hasAnom && (
        <button
          onClick={() => onExplain(m)}
          className="mt-2 flex items-center gap-2 rounded-md border border-warn/20 bg-warn/6 px-3 py-2 text-left text-[0.75rem] transition-colors hover:bg-warn/10"
        >
          <Sparkles size={13} className="shrink-0 text-warn" />
          <span className="line-clamp-1 text-foreground/85">
            {m.anomalies[0].title} — {m.anomalies[0].summary}
          </span>
          <span className="ml-auto shrink-0 font-medium text-primary">Explain</span>
        </button>
      )}
    </Card>
  );
}
