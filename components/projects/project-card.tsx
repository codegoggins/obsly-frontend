import Link from "next/link";
import { GitBranch, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LiveDot } from "@/components/live-dot";
import { PLATFORM_ICONS, FALLBACK_ICON } from "@/components/projects/platform-icon";
import type { Project } from "@/lib/mock/projects";

export function ProjectCard({ project: p }: { project: Project }) {
  const Icon = PLATFORM_ICONS[p.platform] ?? FALLBACK_ICON;

  return (
    <Link href={`/projects/${p.id}`} className="group block">
      <Card className="h-full p-4 transition-colors hover:border-primary/40">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
            <Icon size={17} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate font-mono text-[0.84375rem] font-medium">{p.name}</span>
              <LiveDot tone={p.status === "healthy" ? "ok" : "warn"} size={6} />
            </div>
            <div className="text-[0.6875rem] text-muted-foreground">{p.platform}</div>
          </div>
          <ChevronRight size={16} className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Badge tone="outline" className="font-mono">
            {p.env}
          </Badge>
          {p.repo ? (
            <span className="flex min-w-0 items-center gap-1 truncate font-mono text-[0.6875rem] text-muted-foreground">
              <GitBranch size={11} /> {p.repo}
            </span>
          ) : (
            <span className="text-[0.6875rem] text-muted-foreground">No repo linked</span>
          )}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
          <div>
            <div className="font-mono text-[0.8125rem] font-semibold">{p.events24h}</div>
            <div className="text-[0.625rem] text-muted-foreground">events 24h</div>
          </div>
          <div>
            <div className="font-mono text-[0.8125rem] font-semibold">{p.errorRate}</div>
            <div className="text-[0.625rem] text-muted-foreground">error rate</div>
          </div>
          <div>
            <div className="font-mono text-[0.8125rem] font-semibold">{p.members}</div>
            <div className="text-[0.625rem] text-muted-foreground">members</div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
