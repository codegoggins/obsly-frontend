"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

const TONE = {
  brand: "var(--brand)",
  danger: "var(--danger)",
  warn: "var(--warn)",
  ok: "var(--ok)",
};

type AreaChartProps = {
  data: number[];
  height?: number;
  tone?: keyof typeof TONE;
  label?: string;
  unit?: string;
  anomalies?: { i: number }[];
  xlabels?: string[];
};

export function AreaChart({
  data,
  height = 208,
  tone = "brand",
  label = "value",
  unit = "",
  anomalies = [],
  xlabels = [],
}: AreaChartProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const fillId = useId(); // unique per instance so multiple charts don't share a gradient

  // measure width so the SVG can fill its container responsively
  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => setW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!w) return <div ref={wrap} className="w-full" style={{ height: height + 22 }} />;

  const padL = 8, padR = 8, padT = 14, padB = 22;
  const innerW = w - padL - padR;
  const innerH = height - padT - padB;
  const max = Math.max(...data, 1);
  const step = innerW / (data.length - 1);
  const color = `hsl(${TONE[tone]})`;

  const pts = data.map((v, i) => [padL + i * step, padT + innerH - (v / max) * innerH] as const);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${padT + innerH} L${padL},${padT + innerH} Z`;
  const gridLines = [0, 0.5, 1].map((g) => padT + innerH - g * innerH);
  const labels = xlabels.length ? xlabels : ["", "", "", "", ""];

  const onMove = (e: React.MouseEvent) => {
    const rect = wrap.current!.getBoundingClientRect();
    const idx = Math.round((e.clientX - rect.left - padL) / step);
    setHover(Math.max(0, Math.min(data.length - 1, idx)));
  };

  return (
    <div
      ref={wrap}
      className="relative w-full select-none"
      onMouseMove={onMove}
      onMouseLeave={() => setHover(null)}
    >
      <svg width={w} height={height} className="block max-w-full">
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.26" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {gridLines.map((y, i) => (
          <line key={i} x1={padL} y1={y} x2={w - padR} y2={y} stroke="hsl(var(--grid))" strokeWidth="1" strokeDasharray="3 4" />
        ))}
        <path d={area} fill={`url(#${fillId})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {anomalies.map((a) => (
          <g key={a.i}>
            <circle cx={pts[a.i][0]} cy={pts[a.i][1]} r="9" fill="hsl(var(--warn))" opacity="0.16" />
            <circle cx={pts[a.i][0]} cy={pts[a.i][1]} r="4" fill="hsl(var(--warn))" stroke="hsl(var(--card))" strokeWidth="1.5" />
          </g>
        ))}
        {hover != null && (
          <g>
            <line x1={pts[hover][0]} y1={padT} x2={pts[hover][0]} y2={padT + innerH} stroke="hsl(var(--foreground) / 0.18)" strokeWidth="1" />
            <circle cx={pts[hover][0]} cy={pts[hover][1]} r="4.5" fill={color} stroke="hsl(var(--card))" strokeWidth="2" />
          </g>
        )}
      </svg>

      <div className="mt-1 flex justify-between px-1 font-mono text-[0.625rem] text-muted-foreground/70">
        {labels.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>

      {hover != null && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 rounded-md border border-border bg-popover px-2.5 py-1.5 text-[0.6875rem] shadow-xl"
          style={{ left: pts[hover][0], top: Math.max(0, pts[hover][1] - 52) }}
        >
          <div className="font-mono font-semibold text-foreground">
            {data[hover].toLocaleString()}
            {unit}
          </div>
          <div className="text-muted-foreground">
            {label}
            {xlabels[hover] ? ` · ${xlabels[hover]}` : ""}
          </div>
          {anomalies.some((a) => a.i === hover) && (
            <div className="mt-1 flex items-center gap-1 border-t border-border pt-1 text-warn">
              <Sparkles size={11} /> anomaly
            </div>
          )}
        </div>
      )}
    </div>
  );
}
