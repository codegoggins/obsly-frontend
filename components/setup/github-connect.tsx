"use client";

import { useState } from "react";
import { GitBranch, Check, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { GitHubMark } from "@/components/brand-marks";
import { StepNum } from "@/components/setup/step-num";
import { cn } from "@/lib/utils";
import { REPOS } from "@/lib/mock/setup";

type RepoState = "idle" | "connecting" | "connected";

function RepoSlot({ role, suggested, platform, branch }: (typeof REPOS)[number]) {
  const [state, setState] = useState<RepoState>("idle");
  const connect = () => {
    setState("connecting");
    window.setTimeout(() => setState("connected"), 1200);
  };
  const connected = state === "connected";

  return (
    <div className={cn("rounded-lg border p-3.5 transition-colors", connected ? "border-ok/30 bg-ok/4" : "border-border bg-muted/40")}>
      <div className="flex items-center gap-3">
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", connected ? "bg-ok/12 text-ok" : "bg-card text-foreground")}>
          <GitHubMark size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[0.78125rem] font-semibold">{role}</span>
            <Badge tone="outline">{platform}</Badge>
          </div>
          <div className="mt-0.5 flex items-center gap-2 font-mono text-[0.71875rem] text-muted-foreground">
            <span className={connected ? "text-foreground/80" : ""}>{suggested}</span>
            {connected && (
              <span className="flex items-center gap-1">
                <GitBranch size={11} /> {branch}
              </span>
            )}
          </div>
        </div>
        {connected ? (
          <Badge tone="ok" dot>
            linked
          </Badge>
        ) : (
          <Button size="sm" variant={state === "connecting" ? "secondary" : "default"} onClick={connect} disabled={state === "connecting"}>
            {state === "connecting" ? (
              <>
                <Spinner size={14} /> Connecting
              </>
            ) : (
              <>
                <GitHubMark size={13} /> Connect
              </>
            )}
          </Button>
        )}
      </div>
      {connected && (
        <div className="mt-3 flex items-center gap-2 border-t border-border pt-2.5 text-[0.71875rem] text-muted-foreground">
          <Check size={13} className="text-ok" /> Stack traces from this service now link straight to the source line.
        </div>
      )}
    </div>
  );
}

export function GithubConnect() {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <StepNum n={4} />
        <div className="text-sm font-semibold">Connect your source code</div>
        <Badge tone="muted" className="ml-auto">
          Recommended
        </Badge>
      </div>
      <div className="mt-4 pl-9">
        <p className="mb-3.5 text-[0.78125rem] text-muted-foreground">
          Link your GitHub repositories so Obsly can map every error to the exact file, commit and pull request — for both
          your frontend and backend.
        </p>
        <div className="space-y-2.5">
          {REPOS.map((r) => (
            <RepoSlot key={r.role} {...r} />
          ))}
        </div>
        <button className="mt-3 flex items-center gap-1.5 text-[0.75rem] font-medium text-primary hover:underline">
          <Plus size={13} /> Add another repository
        </button>
      </div>
    </Card>
  );
}
