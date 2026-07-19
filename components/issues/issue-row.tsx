import { ArrowUp, ArrowDown, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/sparkline";
import { LiveDot } from "@/components/live-dot";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Issue } from "@/lib/mock/issues";

export const ROW_GRID = "grid grid-cols-[1.375rem_1fr_5.5rem_4.625rem_5.75rem_5.25rem_6rem] items-center gap-3";

const ASSIGNEES = {
  mara: { initials: "MR", name: "Mara Reyes", tone: "bg-primary/15 text-primary" },
  dev: { initials: "DV", name: "Dev Patel", tone: "bg-warn/15 text-warn" },
};

type IssueRowProps = {
  issue: Issue;
  selected: boolean;
  onToggle: () => void;
};

export function IssueRow({ issue, selected, onToggle }: IssueRowProps) {
  const asg = issue.assignee ? ASSIGNEES[issue.assignee] : null;
  const up = issue.trend > 0;

  return (
    <div
      className={cn(
        ROW_GRID,
        "border-b border-border px-3 py-3 transition-colors last:border-0 hover:bg-accent/60",
        selected && "bg-primary/[0.06]",
      )}
    >
      {/* select */}
      <label className="flex items-center justify-center">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="h-3.5 w-3.5 cursor-pointer rounded border-border bg-card accent-primary"
        />
      </label>

      {/* identity */}
      <div className="flex min-w-0 items-start gap-3">
        <span className={cn("mt-1 h-9 w-1 shrink-0 rounded-full", issue.level === "error" ? "bg-danger" : "bg-warn")} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="shrink-0 font-mono text-[0.78125rem] font-semibold text-foreground">{issue.type}</span>
            <Badge tone="outline" className="shrink-0 font-mono">
              {issue.id}
            </Badge>
            {!issue.handled && (
              <Badge tone="error" className="shrink-0">
                unhandled
              </Badge>
            )}
            <Badge tone={issue.origin === "backend" ? "warn" : "brand"} className="shrink-0">
              {issue.origin}
            </Badge>
          </div>
          <div className="mt-0.5 truncate text-[0.75rem] text-muted-foreground">{issue.title}</div>
          <div className="mt-0.5 flex items-center gap-2 font-mono text-[0.65625rem] text-muted-foreground/70">
            <span className="truncate">{issue.culprit}</span>
            <span className="shrink-0 rounded bg-muted px-1.5 py-px">{issue.env}</span>
            <span className="shrink-0 rounded bg-muted px-1.5 py-px">{issue.release}</span>
          </div>
        </div>
      </div>

      {/* trend */}
      <div className="flex items-center justify-center">
        <Sparkline data={issue.spark} tone={issue.level === "error" ? "danger" : "warn"} w={78} h={30} fill={false} />
      </div>

      {/* events */}
      <div className="text-right">
        <div className="font-mono text-[0.8125rem] font-semibold">{issue.events.toLocaleString()}</div>
        <div className={cn("flex items-center justify-end gap-0.5 text-[0.65625rem] font-medium", up ? "text-danger" : "text-ok")}>
          {up ? <ArrowUp size={9} /> : <ArrowDown size={9} />}
          {Math.abs(issue.trend)}%
        </div>
      </div>

      {/* users */}
      <div className="text-right">
        <div className="font-mono text-[0.8125rem] font-semibold">{issue.users.toLocaleString()}</div>
        <div className="text-[0.65625rem] text-muted-foreground">users</div>
      </div>

      {/* last seen */}
      <div className="text-right">
        <div className="flex items-center justify-end gap-1.5 font-mono text-[0.75rem] text-foreground/80">
          {issue.status !== "resolved" && <LiveDot tone={issue.level === "error" ? "danger" : "warn"} size={6} />}
          {issue.lastSeen}
        </div>
        <div className="text-[0.65625rem] text-muted-foreground">last seen</div>
      </div>

      {/* assignee + status */}
      <div className="flex items-center justify-end gap-2">
        <Tooltip>
          <TooltipTrigger
            render={
              asg ? (
                <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-[0.625rem] font-semibold", asg.tone)}>
                  {asg.initials}
                </span>
              ) : (
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground/50">
                  <User size={11} />
                </span>
              )
            }
          />
          <TooltipContent>{asg ? `Assigned to ${asg.name}` : "Unassigned"}</TooltipContent>
        </Tooltip>
        {issue.status === "resolved" ? (
          <Badge tone="ok" dot>
            resolved
          </Badge>
        ) : (
          <Badge tone="outline" dot>
            open
          </Badge>
        )}
      </div>
    </div>
  );
}
