"use client";

import { useRouter } from "next/navigation";
import { Sparkles, Link2, Bug, Bell } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { StreamText } from "@/components/ui/stream-text";
import type { Metric } from "@/lib/mock/metrics";

type ExplainSheetProps = {
  metric: Metric | null;
  onClose: () => void;
};

function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">{children}</div>;
}

export function ExplainSheet({ metric, onClose }: ExplainSheetProps) {
  const router = useRouter();
  const anomaly = metric?.anomalies[0];

  const openIssue = () => {
    onClose();
    router.push("/issues/OBS-4821");
  };

  return (
    <Sheet open={!!metric} onOpenChange={(open) => !open && onClose()}>
      {metric && anomaly && (
        <SheetContent icon={Sparkles} title="AI metric explanation" subtitle={metric.name}>
          <div className="space-y-5">
            <div className="rounded-lg border border-warn/25 bg-warn/6 p-3.5">
              <div className="mb-1 flex items-center gap-1.5 text-[0.71875rem] font-semibold text-warn">
                <Sparkles size={12} /> Anomaly · 14:05
              </div>
              <div className="text-sm font-semibold">{anomaly.title}</div>
            </div>

            <div>
              <Label>What happened</Label>
              <StreamText text={anomaly.detail} className="text-[0.84375rem] text-foreground/90" />
            </div>

            <div>
              <Label>Correlated signals</Label>
              <div className="space-y-2">
                {anomaly.signal.split(" · ").map((s) => (
                  <div key={s} className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5">
                    <Link2 size={14} className="text-primary" />
                    <span className="font-mono text-[0.78125rem]">{s}</span>
                    <button onClick={openIssue} className="ml-auto text-[0.75rem] font-medium text-primary hover:underline">
                      Open
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Suggested next step</Label>
              <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                Increase the{" "}
                <code className="rounded bg-primary/12 px-1 font-mono text-[0.75rem] text-primary">checkout-api</code> DB
                pool from 10 → 20 and add a retry budget on empty-cart requests to stop the storm.
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <Button onClick={openIssue}>
                <Bug size={14} /> Open related issue
              </Button>
              <Button variant="outline">
                <Bell size={14} /> Alert me
              </Button>
            </div>
          </div>
        </SheetContent>
      )}
    </Sheet>
  );
}
