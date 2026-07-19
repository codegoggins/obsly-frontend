"use client";

import { Sparkles, Check, GitPullRequest, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StreamText } from "@/components/ui/stream-text";
import { CopyButton } from "@/components/ui/copy-button";
import { LiveDot } from "@/components/live-dot";
import { cn } from "@/lib/utils";
import { AI_ROOTCAUSE, AI_FIX } from "@/lib/mock/issue-detail";

export function AiRootCause() {
  return (
    <Card glow className="border-primary/25 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Sparkles size={16} />
          </span>
          <div>
            <div className="text-[0.84375rem] font-semibold">AI root cause analysis</div>
            <div className="flex items-center gap-1.5 text-[0.6875rem] text-primary">
              <LiveDot /> analyzed 1,248 events · 6 breadcrumb paths
            </div>
          </div>
        </div>
        <Badge tone="brand">
          <Check size={11} /> 94% confidence
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div>
          <div className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">What&apos;s happening</div>
          <StreamText text={AI_ROOTCAUSE} className="text-[0.84375rem] text-foreground/90" />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">Suggested fix</span>
            <CopyButton text={AI_FIX} label="Copy diff" />
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-muted/50">
            <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
              <span className="font-mono text-[0.6875rem] text-muted-foreground">CartSummary.tsx</span>
              <Badge tone="ok">1 line</Badge>
            </div>
            <pre className="overflow-x-auto p-3 font-mono text-[0.75rem] leading-[1.7]">
              {AI_FIX.split("\n").map((ln, i) => (
                <div
                  key={i}
                  className={cn(
                    "whitespace-pre px-1",
                    ln.startsWith("+") && "bg-ok/12 text-ok",
                    ln.startsWith("-") && "bg-danger/12 text-danger",
                    ln.startsWith("//") && "text-muted-foreground",
                  )}
                >
                  {ln}
                </div>
              ))}
            </pre>
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <Button size="sm">
              <GitPullRequest size={13} /> Create PR
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink size={13} /> Open in editor
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
