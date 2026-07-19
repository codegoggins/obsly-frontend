"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Check, Sparkles, Send, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LiveDot } from "@/components/live-dot";
import { cn } from "@/lib/utils";

const CHECKS = [
  { label: "SDK handshake", tone: "ok" as const },
  { label: "Awaiting ingest", tone: "warn" as const },
  { label: "Source maps", tone: "warn" as const },
];

type LiveStatusProps = {
  received: boolean;
  onSimulate: () => void;
};

export function LiveStatus({ received, onSimulate }: LiveStatusProps) {
  const router = useRouter();

  return (
    <div className="lg:sticky lg:top-4 lg:self-start">
      <Card glow className={cn("p-5 transition-colors", received ? "border-ok/30" : "border-primary/20")}>
        <div className="mb-3 flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
          {received ? <span className="text-ok">Connected</span> : <span className="text-primary">Listening</span>}
          {received ? <Check size={13} className="text-ok" /> : <LiveDot />}
        </div>

        {received ? (
          <motion.div className="text-center" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-ok/12 text-ok">
              <Check size={34} />
            </div>
            <div className="text-[0.9375rem] font-semibold">First event received!</div>
            <p className="mx-auto mt-1 max-w-55 text-[0.75rem] text-muted-foreground">
              A <span className="font-mono text-foreground/80">test.event</span> just arrived from{" "}
              <span className="font-mono text-foreground/80">localhost:3000</span>.
            </p>
            <div className="mt-4 rounded-lg border border-border bg-card p-2.5 text-left font-mono text-[0.6875rem] text-muted-foreground">
              <div className="flex justify-between">
                <span>event.type</span>
                <span className="text-foreground/80">message</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span>received</span>
                <span className="text-ok">just now</span>
              </div>
            </div>
            <Button className="mt-4 w-full" onClick={() => router.push("/")}>
              Go to dashboard <ArrowRight size={14} />
            </Button>
          </motion.div>
        ) : (
          <div className="text-center">
            <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center">
              <motion.span
                className="absolute inset-0 rounded-full bg-primary/15"
                animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
              <span className="absolute inset-2 rounded-full bg-primary/10" />
              <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Sparkles size={20} />
              </span>
            </div>
            <div className="text-sm font-semibold">Waiting for your first event…</div>
            <p className="mx-auto mt-1 max-w-55 text-[0.75rem] text-muted-foreground">
              Run your app and trigger any error or metric. We&apos;ll catch it instantly.
            </p>
            <div className="mt-4 space-y-1.5 text-left">
              {CHECKS.map((c) => (
                <div key={c.label} className="flex items-center gap-2 text-[0.75rem] text-muted-foreground">
                  <LiveDot tone={c.tone} size={6} /> {c.label}
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-4 w-full" onClick={onSimulate}>
              <Send size={14} /> Send a test event
            </Button>
          </div>
        )}
      </Card>
      <p className="mt-3 text-center text-[0.71875rem] text-muted-foreground">
        Need help? <span className="text-primary">Read the docs</span>
      </p>
    </div>
  );
}
