"use client";

import { useState } from "react";
import { ChevronRight, Code2, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/ui/section-title";
import { cn } from "@/lib/utils";
import { STACK, type StackFrame } from "@/lib/mock/issue-detail";

function Frame({ frame, defaultOpen }: { frame: StackFrame; defaultOpen: boolean }) {
  const hasCtx = !!frame.context?.length;
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn("border-b border-border last:border-0", !frame.inApp && "opacity-65")}>
      <button
        onClick={() => hasCtx && setOpen((o) => !o)}
        className={cn("flex w-full items-center gap-2 px-3.5 py-2 text-left", hasCtx && "hover:bg-accent")}
      >
        {hasCtx ? (
          <ChevronRight size={13} className={cn("shrink-0 text-muted-foreground transition-transform", open && "rotate-90")} />
        ) : (
          <span className="w-[13px]" />
        )}
        <span className="font-mono text-[0.78125rem] text-foreground">{frame.fn}</span>
        <span className="truncate font-mono text-[0.75rem] text-muted-foreground">in {frame.file}</span>
        <span className="ml-auto shrink-0 font-mono text-[0.71875rem] text-muted-foreground/80">
          {frame.line}:{frame.col}
        </span>
        {frame.inApp && (
          <Badge tone="brand" className="ml-1 shrink-0">
            in-app
          </Badge>
        )}
      </button>
      {open && frame.context && (
        <div className="overflow-x-auto bg-muted/40 font-mono text-[0.75rem] leading-[1.7]">
          {frame.context.map((l) => (
            <div key={l.n} className={cn("flex gap-4 px-3.5", l.err && "bg-danger/10")}>
              <span className={cn("w-7 shrink-0 select-none text-right tabular-nums", l.err ? "text-danger/80" : "text-muted-foreground/50")}>
                {l.n}
              </span>
              <span className={cn("whitespace-pre", l.err ? "text-foreground" : "text-foreground/75")}>
                {l.t}
                {l.err && <span className="ml-3 text-danger">◄ throws here</span>}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function StackTrace() {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <SectionTitle icon={Code2}>Stack trace</SectionTitle>
        <Badge tone="outline">most recent call first</Badge>
      </div>
      <div className="border-t border-border">
        {STACK.map((f, i) => (
          <Frame key={`${f.fn}-${i}`} frame={f} defaultOpen={i === 0} />
        ))}
      </div>
      <button className="flex w-full items-center justify-center gap-1.5 border-t border-border py-2 text-[0.75rem] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
        <ChevronDown size={13} /> Show 14 collapsed system frames
      </button>
    </Card>
  );
}
