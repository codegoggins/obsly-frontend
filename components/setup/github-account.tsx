"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { GitHubMark } from "@/components/brand-marks";
import { cn } from "@/lib/utils";

type AccountState = "idle" | "connecting" | "connected";

// top-level GitHub account (OAuth) connection; repo-level linking lives in step 4
export function GithubAccount() {
  const [state, setState] = useState<AccountState>("idle");
  const connected = state === "connected";

  const connect = () => {
    setState("connecting");
    window.setTimeout(() => setState("connected"), 1300);
  };

  return (
    <Card className={cn("flex flex-wrap items-center gap-4 p-4", connected && "border-ok/30")}>
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          connected ? "bg-ok/12 text-ok" : "bg-foreground/5 text-foreground",
        )}
      >
        <GitHubMark size={22} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{connected ? "GitHub connected" : "Connect GitHub"}</span>
          {connected && (
            <Badge tone="ok" dot>
              active
            </Badge>
          )}
        </div>
        {connected ? (
          <div className="mt-0.5 font-mono text-[0.71875rem] text-muted-foreground">@codegoggins · acme · 4 repositories</div>
        ) : (
          <p className="mt-0.5 text-[0.78125rem] text-muted-foreground">
            Authorize Obsly to link stack traces to source and open fix PRs automatically.
          </p>
        )}
      </div>

      {connected ? (
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 text-[0.71875rem] text-ok sm:flex">
            <Check size={13} /> Access granted
          </span>
          <Button variant="secondary" size="sm" onClick={() => setState("idle")}>
            Disconnect
          </Button>
        </div>
      ) : (
        <Button variant={state === "connecting" ? "secondary" : "default"} onClick={connect} disabled={state === "connecting"}>
          {state === "connecting" ? (
            <>
              <Spinner size={14} /> Connecting…
            </>
          ) : (
            <>
              <GitHubMark size={14} /> Connect GitHub
            </>
          )}
        </Button>
      )}
    </Card>
  );
}
