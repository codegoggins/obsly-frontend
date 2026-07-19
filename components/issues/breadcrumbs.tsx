import { Clock, Globe, Circle, Link2, Layers, Code2, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/ui/section-title";
import { cn } from "@/lib/utils";
import { BREADCRUMBS, type Breadcrumb } from "@/lib/mock/issue-detail";

const CAT_ICON: Record<Breadcrumb["cat"], LucideIcon> = {
  navigation: Globe,
  "ui.click": Circle,
  http: Link2,
  state: Layers,
  render: Code2,
};

export function Breadcrumbs() {
  return (
    <Card className="p-5">
      <SectionTitle icon={Clock} action={<Badge tone="outline">6 events before crash</Badge>}>
        Breadcrumbs
      </SectionTitle>
      <div className="mt-2">
        {BREADCRUMBS.map((b, i) => {
          const Icon = CAT_ICON[b.cat];
          const last = i === BREADCRUMBS.length - 1;
          return (
            <div key={i} className="relative flex gap-3 pb-4 last:pb-0">
              {!last && <span className="absolute left-[0.6875rem] top-6 h-full w-px bg-border" />}
              <span
                className={cn(
                  "relative z-10 mt-0.5 flex h-[1.375rem] w-[1.375rem] shrink-0 items-center justify-center rounded-full border border-border bg-card",
                  b.level === "error" && "border-danger/40",
                )}
              >
                <Icon size={11} className={cn(b.level === "error" ? "text-danger" : b.level === "warning" ? "text-warn" : "text-muted-foreground")} />
              </span>
              <div className="min-w-0 flex-1">
                <span className={cn("text-[0.78125rem]", b.level === "error" ? "font-medium text-danger" : "text-foreground/90")}>{b.msg}</span>
                <div className="mt-0.5 flex items-center gap-2 font-mono text-[0.6875rem] text-muted-foreground">
                  <span className="rounded bg-muted px-1.5 py-0.5">{b.cat}</span>
                  <span className="truncate">{b.data}</span>
                  <span className="ml-auto shrink-0">{b.t}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
