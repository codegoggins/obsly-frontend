"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cn } from "@/lib/utils";
import type { YearActivity, ActivityCell } from "@/lib/mock/activity";

const TONE = {
  danger: "var(--danger)",
  warn: "var(--warn)",
  brand: "var(--brand)",
  ok: "var(--ok)",
};

const STEPS = [0, 0.16, 0.36, 0.6, 0.85]; // opacity per intensity bucket
const GAP = 3;

type CalendarHeatmapProps = {
  activity: YearActivity;
  tone?: keyof typeof TONE;
  onSelect?: (cell: ActivityCell) => void;
};

export function CalendarHeatmap({ activity, tone = "danger", onSelect }: CalendarHeatmapProps) {
  const { weeks, months } = activity;
  const wrap = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [active, setActive] = useState<{ cell: ActivityCell; el: HTMLElement } | null>(null);

  // measure so the calendar fills the card width; cells stay square
  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => setW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const color = TONE[tone];
  const max = Math.max(1, ...weeks.flat().map((c) => c?.count ?? 0));
  const level = (v: number) => {
    if (v <= 0) return 0;
    const r = v / max;
    if (r < 0.12) return 1;
    if (r < 0.3) return 2;
    if (r < 0.6) return 3;
    return 4;
  };
  const cellColor = (v: number) => (v <= 0 ? "hsl(var(--muted))" : `hsl(${color} / ${STEPS[level(v)]})`);

  // solve cell size from measured width, then clamp to a comfortable range
  const cols = weeks.length;
  const raw = w ? (w - (cols - 1) * GAP) / cols : 0;
  const cs = Math.max(9, Math.min(22, Math.floor(raw)));
  const colStep = cs + GAP;

  return (
    <div ref={wrap} className="w-full overflow-x-auto">
      {w > 0 && (
        <div style={{ minWidth: cols * colStep }}>
          {/* month labels */}
          <div className="relative mb-1 h-4 font-mono text-[0.625rem] text-muted-foreground/70">
            {months.map((m, i) => (
              <span key={i} className="absolute" style={{ left: m.col * colStep }}>
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex" style={{ gap: GAP }}>
            {/* week columns */}
            {weeks.map((column, ci) => (
              <div key={ci} className="flex flex-col" style={{ gap: GAP }}>
                {column.map((cell, ri) =>
                  cell ? (
                    <div
                      key={ri}
                      onMouseEnter={(e) => setActive({ cell, el: e.currentTarget })}
                      onMouseLeave={() => setActive(null)}
                      onClick={() => onSelect?.(cell)}
                      className={cn(
                        "rounded-[2px] outline-1 outline-transparent transition-[outline] hover:outline-foreground/40",
                        onSelect && "cursor-pointer",
                      )}
                      style={{ width: cs, height: cs, background: cellColor(cell.count) }}
                    />
                  ) : (
                    <div key={ri} style={{ width: cs, height: cs }} />
                  ),
                )}
              </div>
            ))}
          </div>

          {/* legend */}
          <div className="mt-3 flex items-center justify-end gap-1.5 text-[0.65625rem] text-muted-foreground/70">
            <span>Less</span>
            {STEPS.map((_, i) => (
              <span
                key={i}
                className="size-2.75 rounded-[2px]"
                style={{ background: i === 0 ? "hsl(var(--muted))" : `hsl(${color} / ${STEPS[i]})` }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      )}

      {/* single tooltip, anchored to whichever cell is hovered */}
      <TooltipPrimitive.Provider>
        <TooltipPrimitive.Root open={!!active}>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Positioner anchor={active?.el ?? null} side="top" sideOffset={6} className="z-50">
              <TooltipPrimitive.Popup className="rounded-md border border-border bg-popover px-2.5 py-1.5 text-[0.6875rem] text-popover-foreground shadow-xl">
                {active && (
                  <>
                    <span className="font-semibold text-foreground">{active.cell.count.toLocaleString()}</span>{" "}
                    {active.cell.count === 1 ? "issue" : "issues"}
                    <span className="text-muted-foreground"> · {active.cell.label}</span>
                  </>
                )}
              </TooltipPrimitive.Popup>
            </TooltipPrimitive.Positioner>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    </div>
  );
}
