"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";
import { LiveDot } from "@/components/live-dot";
import { Sparkline } from "@/components/sparkline";
import { Card } from "@/components/ui/card";
import { series } from "@/lib/series";
import { cn } from "@/lib/utils";

type Line = { t: string; tone: "danger" | "warn" | "ok"; meta: string };

const LINES: Line[] = [
  { t: "TypeError in CartSummary.computeTotal", tone: "danger", meta: "OBS-4821 · 412 users" },
  { t: "p95 latency back under 600ms", tone: "ok", meta: "checkout-api · resolved" },
  { t: "PaymentDeclinedError spike detected", tone: "warn", meta: "OBS-4815 · 287 users" },
  { t: "Release 2.14.1 rolled out cleanly", tone: "ok", meta: "no new errors · 1h" },
];

const DOT: Record<Line["tone"], string> = {
  danger: "bg-danger",
  warn: "bg-warn",
  ok: "bg-ok",
};

const STATS: [string, string][] = [
  ["2.4M", "events / day"],
  ["<30s", "to root cause"],
  ["1,200+", "teams"],
];

export function Showcase() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 2600);
    return () => clearInterval(t);
  }, []);

  const feed = [LINES[tick % 4], LINES[(tick + 1) % 4], LINES[(tick + 2) % 4]];

  return (
    <div className="relative hidden w-[46%] shrink-0 overflow-hidden border-r border-border bg-[hsl(240_12%_4%)] lg:block xl:w-[50%]">
      <div className="brand-glow pointer-events-none absolute inset-0" />
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="glow-blob pointer-events-none absolute -left-24 top-1/3 h-105 w-105 rounded-full opacity-40 blur-[5.625rem]" />

      <div className="relative flex h-full flex-col p-10 xl:p-14">
        <Logo size="md" />

        <div className="mt-auto max-w-110">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <LiveDot /> Watching your production, right now
          </div>
          <h2 className="text-[2.125rem] font-bold leading-[1.1] tracking-tight xl:text-[2.5rem]">
            Find the error
            <br />
            before your <span className="text-primary">users</span> do.
          </h2>
          <p className="mt-4 max-w-95 text-[0.90625rem] leading-relaxed text-muted-foreground">
            Obsly groups every crash, traces it back to the exact line and the button that
            triggered it, and explains it in plain English.
          </p>
        </div>

        <div className="mt-9 space-y-2.5">
          <div className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground/70">
            <Sparkles size={12} className="text-primary" /> live incident feed
          </div>
          {feed.map((l, i) => (
            <Card
              key={`${tick}-${i}`}
              className="fade-up flex items-center gap-3 rounded-xl bg-card/70 px-3.5 py-3 backdrop-blur"
              style={{ animationDelay: `${i * 80}ms`, opacity: 1 - i * 0.18 }}
            >
              <span className={cn("h-2 w-2 shrink-0 rounded-full", DOT[l.tone])} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-mono text-[0.78125rem] text-foreground/90">{l.t}</div>
                <div className="truncate text-[0.6875rem] text-muted-foreground">{l.meta}</div>
              </div>
              <Sparkline data={series(20, 14, 22, i * 7 + tick)} tone={l.tone} w={54} h={22} fill={false} />
            </Card>
          ))}
        </div>

        <div className="mt-9 flex items-center gap-7 border-t border-border pt-6">
          {STATS.map(([v, l]) => (
            <div key={l}>
              <div className="font-mono text-[1.1875rem] font-semibold">{v}</div>
              <div className="text-[0.6875rem] text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
