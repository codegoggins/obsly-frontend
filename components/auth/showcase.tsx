"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";
import { LiveDot } from "@/components/live-dot";
import { Sparkline } from "@/components/sparkline";
import { Card } from "@/components/ui/card";
import { series } from "@/lib/series";

type Line = { id: number; t: string; tone: "danger" | "warn" | "ok"; meta: string };

const LINES: Line[] = [
  { id: 0, t: "TypeError in CartSummary.computeTotal", tone: "danger", meta: "OBS-4821 · 412 users" },
  { id: 1, t: "p95 latency back under 600ms", tone: "ok", meta: "checkout-api · resolved" },
  { id: 2, t: "PaymentDeclinedError spike detected", tone: "warn", meta: "OBS-4815 · 287 users" },
  { id: 3, t: "Release 2.14.1 rolled out cleanly", tone: "ok", meta: "no new errors · 1h" },
];

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

        <div className="mt-9">
          <div className="mb-2.5 flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground/70">
            <Sparkles size={12} className="text-primary" /> live incident feed
          </div>

          <div className="flex flex-col gap-2.5">
            <AnimatePresence mode="popLayout" initial={false}>
              {feed.map((l, i) => (
                <motion.div
                  key={l.id}
                  layout
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1 - i * 0.18, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Card className="flex items-center gap-3 rounded-xl bg-card/70 px-3.5 py-3 backdrop-blur">
                    <LiveDot tone={l.tone} size={8} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-mono text-[0.78125rem] text-foreground/90">{l.t}</div>
                      <div className="truncate text-[0.6875rem] text-muted-foreground">{l.meta}</div>
                    </div>
                    <Sparkline data={series(20, 14, 22, l.id * 7 + 11)} tone={l.tone} w={54} h={22} fill={false} />
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
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
