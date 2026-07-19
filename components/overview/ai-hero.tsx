"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Bug, TrendingUp, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StreamText } from "@/components/ui/stream-text";
import { LiveDot } from "@/components/live-dot";
import { HERO_TEXT } from "@/lib/mock/dashboard";

// the "what's happening right now" AI narration; re-analyze replays the stream
export function AiHero() {
  const router = useRouter();
  const [replay, setReplay] = useState(0);

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

          <StreamText key={replay} text={HERO_TEXT} className="max-w-216 text-sm text-foreground/90" />

          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={() => router.push("/issues")}>
              <Bug size={13} /> Investigate OBS-4821
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push("/metrics")}>
              <TrendingUp size={13} /> View error metrics
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setReplay((n) => n + 1)}>
              <RefreshCw size={13} /> Re-analyze
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
