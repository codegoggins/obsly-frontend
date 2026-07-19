import { Layers } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { LiveDot } from "@/components/live-dot";
import { PROJECTS } from "@/lib/mock/dashboard";

export function ProjectHealth() {
  return (
    <div className="space-y-4">
      <SectionTitle icon={Layers}>Project health</SectionTitle>
      <Card className="divide-y divide-border">
        {PROJECTS.map((project) => (
          <div key={project.id} className="flex items-center gap-3 px-4 py-3">
            <LiveDot tone={project.status === "healthy" ? "ok" : "warn"} />
            <div className="min-w-0 flex-1">
              <div className="truncate font-mono text-[0.78125rem] font-medium">{project.name}</div>
              <div className="text-[0.6875rem] text-muted-foreground">{project.platform}</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[0.8125rem] font-semibold">{project.errors.toLocaleString()}</div>
              <div className="text-[0.65625rem] text-muted-foreground">errors</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
