import Link from "next/link";
import { Flame, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/sparkline";
import { cn } from "@/lib/utils";
import { ISSUES } from "@/lib/mock/issues";

const allIssuesLink = (
  <Link href="/issues" className="text-[0.75rem] font-medium text-primary hover:underline">
    All issues
  </Link>
);

export function TopIssues() {
  const top = ISSUES.filter((i) => i.status === "unresolved").slice(0, 5);

  return (
    <Card className="p-5">
      <SectionTitle icon={Flame} action={allIssuesLink}>
        Top issues
      </SectionTitle>
      <div className="-mx-1.5 space-y-0.5">
        {top.map((issue) => (
          <Link
            key={issue.id}
            href="/issues"
            className="group flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition-colors hover:bg-accent"
          >
            <span
              className={cn(
                "mt-0.5 h-7 w-1 shrink-0 rounded-full",
                issue.level === "error" ? "bg-danger" : "bg-warn",
              )}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-mono text-[0.78125rem] font-medium text-foreground">{issue.type}</span>
                <Badge tone="outline" className="font-mono">
                  {issue.id}
                </Badge>
              </div>
              <div className="truncate text-[0.71875rem] text-muted-foreground">{issue.culprit}</div>
            </div>
            <Sparkline data={issue.spark} tone={issue.level === "error" ? "danger" : "warn"} w={56} h={24} fill={false} />
            <div className="w-14 text-right">
              <div className="font-mono text-[0.8125rem] font-semibold">{issue.events.toLocaleString()}</div>
              <div className="text-[0.65625rem] text-muted-foreground">events</div>
            </div>
            <ChevronRight size={15} className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </Card>
  );
}
