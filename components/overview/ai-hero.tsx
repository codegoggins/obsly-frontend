"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Sparkles, Bug, TrendingUp, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StreamText } from "@/components/ui/stream-text";
import { Spinner } from "@/components/ui/spinner";
import { LiveDot } from "@/components/live-dot";
import { HERO_TEXT } from "@/lib/mock/dashboard";

// the "what's happening right now" AI narration; re-analyze re-runs the stream
export function AiHero() {
  const router = useRouter();
  const [replay, setReplay] = useState(0);
  const [thinking, setThinking] = useState(false);
  const timer = useRef<number>(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const reanalyze = () => {
    setThinking(true);
    timer.current = window.setTimeout(() => {
      setThinking(false);
      setReplay((n) => n + 1);
    }, 1100);
  };

  return (
    <Card glow className="border-primary/20 p-5">
      <div className="flex items-start gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Sparkles size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-primary">
              Obsly · what&apos;s happening right now
            </span>
            <LiveDot />
          </div>

          {thinking ? (
            <div className="max-w-216">
              <div className="mb-2 flex items-center gap-2 text-[0.75rem] font-medium text-primary">
                <Spinner size={13} /> Re-analyzing 3,142 events…
              </div>
              <motion.div
                className="space-y-2"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="h-3 w-11/12 rounded bg-muted" />
                <div className="h-3 w-4/5 rounded bg-muted" />
                <div className="h-3 w-3/5 rounded bg-muted" />
              </motion.div>
            </div>
          ) : (
            <StreamText key={replay} text={HERO_TEXT} className="max-w-216 text-sm text-foreground/90" />
          )}

          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={() => router.push("/issues/OBS-4821")}>
              <Bug size={13} /> Investigate OBS-4821
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push("/metrics")}>
              <TrendingUp size={13} /> View error metrics
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={reanalyze} disabled={thinking}>
              <RefreshCw size={13} /> Re-analyze
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
