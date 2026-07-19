"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { Sparkles, Link2 } from "lucide-react";
import type { MetricSeries, MetricAnomaly } from "@/lib/mock/metrics";

const TONE: Record<string, string> = {
  brand: "var(--brand)",
  danger: "var(--danger)",
  warn: "var(--warn)",
  ok: "var(--ok)",
  muted: "var(--muted-foreground)",
};
const colorOf = (t: string) => `hsl(${TONE[t] ?? TONE.brand})`;

type MetricChartProps = {
  series: MetricSeries[];
  height?: number;
  anomalies?: MetricAnomaly[];
  xlabels?: string[];
  legend?: boolean;
  fmt?: (v: number) => string;
};

export function MetricChart({
  series,
  height = 150,
  anomalies = [],
  xlabels = [],
  legend = false,
  fmt,
}: MetricChartProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [hoverAnom, setHoverAnom] = useState<number | null>(null);
  const gid = useId();

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => setW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const format = fmt ?? ((v: number) => v.toLocaleString());
  const N = series[0].data.length;
  const padL = 6, padR = 6, padT = 12, padB = 20;
  const innerW = w - padL - padR;
  const innerH = height - padT - padB;
  const max = Math.max(...series.flatMap((s) => s.data), 1);
  const step = N > 1 ? innerW / (N - 1) : innerW;
  const ptsOf = (data: number[]) => data.map((v, i) => [padL + i * step, padT + innerH - (v / max) * innerH] as const);
  const gridLines = [0, 0.5, 1].map((g) => padT + innerH - g * innerH);

  const axisCount = Math.min(6, N);
  const axisLabels = Array.from({ length: axisCount }, (_, i) => {
    const idx = axisCount === 1 ? 0 : Math.round((i * (N - 1)) / (axisCount - 1));
    return xlabels[idx] ?? "";
  });

  const onMove = (e: React.MouseEvent) => {
    if (!w) return;
    const rect = wrap.current!.getBoundingClientRect();
    const idx = Math.round((e.clientX - rect.left - padL) / step);
    setHover(Math.max(0, Math.min(N - 1, idx)));
  };

  const activeAnom = hoverAnom != null ? anomalies.find((a) => a.i === hoverAnom) : null;

  return (
    <div className="w-full">
      {legend && (
        <div className="mb-2 flex items-center gap-3.5">
          {series.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
              <span className="h-0.75 w-3.5 rounded-full" style={{ background: colorOf(s.tone) }} /> {s.label}
            </span>
          ))}
        </div>
      )}

      <div
        ref={wrap}
        className="relative w-full cursor-crosshair select-none"
        style={{ height }}
        onMouseMove={onMove}
        onMouseLeave={() => {
          setHover(null);
          setHoverAnom(null);
        }}
      >
        {w > 0 && (
          <svg width={w} height={height} className="block max-w-full">
            <defs>
              {series.map((s, si) => (
                <linearGradient key={si} id={`${gid}-${si}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colorOf(s.tone)} stopOpacity="0.24" />
                  <stop offset="100%" stopColor={colorOf(s.tone)} stopOpacity="0.01" />
                </linearGradient>
              ))}
            </defs>

            {gridLines.map((y, i) => (
              <line key={i} x1={padL} y1={y} x2={w - padR} y2={y} stroke="hsl(var(--grid))" strokeWidth="1" strokeDasharray="3 4" />
            ))}

            {series.map((s, si) => {
              const pts = ptsOf(s.data);
              const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
              const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${padT + innerH} L${padL},${padT + innerH} Z`;
              return (
                <g key={si}>
                  {s.type === "area" && <path d={area} fill={`url(#${gid}-${si})`} />}
                  <path
                    d={line}
                    fill="none"
                    stroke={colorOf(s.tone)}
                    strokeWidth={s.emphasis ? 2.2 : 1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={s.dim ? 0.55 : 1}
                  />
                </g>
              );
            })}

            {anomalies.map((a) => {
              const p = ptsOf(series[a.series ?? 0].data)[a.i];
              const active = hoverAnom === a.i;
              return (
                <g key={a.i} className="cursor-pointer" onMouseEnter={() => setHoverAnom(a.i)} onMouseLeave={() => setHoverAnom(null)}>
                  <circle cx={p[0]} cy={p[1]} r={active ? 11 : 8} fill="hsl(var(--warn))" opacity="0.16" />
                  <circle cx={p[0]} cy={p[1]} r="4" fill="hsl(var(--warn))" stroke="hsl(var(--card))" strokeWidth="1.5" />
                </g>
              );
            })}

            {hover != null && (
              <g>
                <line x1={padL + hover * step} y1={padT} x2={padL + hover * step} y2={padT + innerH} stroke="hsl(var(--foreground) / 0.18)" strokeWidth="1" />
                {series.map((s, si) => {
                  const p = ptsOf(s.data)[hover];
                  return <circle key={si} cx={p[0]} cy={p[1]} r="4" fill={colorOf(s.tone)} stroke="hsl(var(--card))" strokeWidth="1.5" />;
                })}
              </g>
            )}
          </svg>
        )}

        {/* anomaly tooltip */}
        {activeAnom && (() => {
          const p = ptsOf(series[activeAnom.series ?? 0].data)[activeAnom.i];
          return (
            <div
              className="pointer-events-none absolute z-30 w-60 -translate-x-1/2 rounded-lg border border-warn/30 bg-popover p-3 shadow-2xl"
              style={{ left: Math.min(Math.max(120, p[0]), w - 120), top: Math.max(6, p[1] - 116) }}
            >
              <div className="mb-1 flex items-center gap-1.5 text-[0.6875rem] font-semibold text-warn">
                <Sparkles size={12} /> Anomaly detected
              </div>
              <div className="text-[0.75rem] font-medium text-foreground">{activeAnom.title}</div>
              <p className="mt-1 text-[0.71875rem] leading-relaxed text-muted-foreground">{activeAnom.detail}</p>
              <div className="mt-2 flex items-center gap-1.5 border-t border-border pt-1.5 text-[0.6875rem] text-muted-foreground">
                <Link2 size={11} /> correlated: <span className="font-mono text-foreground/80">{activeAnom.signal}</span>
              </div>
            </div>
          );
        })()}

        {/* value tooltip */}
        {hover != null && !activeAnom && (
          <div
            className="pointer-events-none absolute z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2.5 py-1.5 text-[0.6875rem] shadow-xl"
            style={{ left: Math.min(Math.max(60, padL + hover * step), w - 60), top: 2 }}
          >
            <div className="mb-0.5 font-mono text-[0.625rem] text-muted-foreground">{xlabels[hover] ?? ""}</div>
            {series.map((s, si) => (
              <div key={si} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: colorOf(s.tone) }} />
                <span className="text-muted-foreground">{s.label}</span>
                <span className="ml-auto font-mono font-semibold text-foreground">{format(s.data[hover])}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-1 flex justify-between px-1 font-mono text-[0.625rem] text-muted-foreground/70">
        {axisLabels.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
    </div>
  );
}
