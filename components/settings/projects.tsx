"use client";

import { useRouter } from "next/navigation";
import { Rocket, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LiveDot } from "@/components/live-dot";
import { SETTINGS_PROJECTS, ORG } from "@/lib/mock/settings";

const GRID = "grid grid-cols-[1.6fr_0.8fr_0.7fr_0.7fr_auto] items-center gap-3";

export function Projects() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Projects</h2>
          <p className="text-[0.78125rem] text-muted-foreground">
            {SETTINGS_PROJECTS.length} projects in {ORG.name}
          </p>
        </div>
        <Button onClick={() => router.push("/onboarding")}>
          <Rocket size={14} /> New project
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className={`${GRID} border-b border-border px-4 py-2.5 text-[0.6875rem] font-medium uppercase tracking-wide text-muted-foreground`}>
          <span>Project</span>
          <span>Environment</span>
          <span className="text-right">Members</span>
          <span className="text-right">Events 24h</span>
          <span className="w-8" />
        </div>
        {SETTINGS_PROJECTS.map((p) => (
          <div key={p.id} className={`${GRID} border-b border-border px-4 py-3 transition-colors last:border-0 hover:bg-accent/40`}>
            <div className="flex items-center gap-2.5">
              <LiveDot tone={p.status === "healthy" ? "ok" : "warn"} />
              <div className="min-w-0">
                <div className="truncate font-mono text-[0.8125rem] font-medium">{p.name}</div>
                <div className="text-[0.6875rem] text-muted-foreground">{p.platform}</div>
              </div>
            </div>
            <div>
              <Badge tone="outline" className="font-mono">
                {p.env}
              </Badge>
            </div>
            <div className="text-right font-mono text-[0.8125rem]">{p.members}</div>
            <div className="text-right font-mono text-[0.8125rem]">{p.events}</div>
            <button
              onClick={() => router.push("/onboarding")}
              aria-label={`Open ${p.name}`}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        ))}
      </Card>
    </div>
  );
}
