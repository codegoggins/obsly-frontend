import { Link2, Globe, Code2, Layers, ArrowRight, ChevronDown, Circle, Flame, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/ui/section-title";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";
import type { IssueDetail } from "@/lib/mock/issue-detail";

const METHOD_TONE: Record<string, "ok" | "brand" | "error" | "warn" | "muted"> = {
  GET: "ok",
  POST: "brand",
  DELETE: "error",
  PUT: "warn",
  PATCH: "warn",
};

function Arrow() {
  return (
    <div className="flex shrink-0 items-center justify-center self-center text-muted-foreground/40 lg:px-1">
      <ArrowRight size={18} className="hidden lg:block" />
      <ChevronDown size={18} className="lg:hidden" />
    </div>
  );
}

function Stage({ icon: Icon, label, active, children }: { icon: LucideIcon; label: string; active: boolean; children: React.ReactNode }) {
  return (
    <div className={cn("relative min-w-0 flex-1 rounded-xl border p-3.5 transition-colors", active ? "border-danger/40 bg-danger/5" : "border-border bg-card")}>
      <div className="mb-2.5 flex items-center gap-2">
        <span className={cn("flex h-6 w-6 items-center justify-center rounded-lg", active ? "bg-danger/15 text-danger" : "bg-muted text-muted-foreground")}>
          <Icon size={13} />
        </span>
        <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        {active && (
          <Badge tone="error" className="ml-auto">
            <Flame size={10} /> error here
          </Badge>
        )}
      </div>
      {children}
    </div>
  );
}

export function RequestPath({ detail }: { detail: IssueDetail }) {
  const methodTone = detail.api ? METHOD_TONE[detail.api.method] ?? "muted" : "muted";

  return (
    <Card className="p-5">
      <SectionTitle icon={Link2} action={<Badge tone="outline">{detail.origin} origin</Badge>}>
        Request path
      </SectionTitle>
      <p className="-mt-1.5 mb-4 text-[0.75rem] text-muted-foreground">
        How a user reaches this error — from the button they click, through the API, to the backend code.
      </p>

      <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
        <Stage icon={Globe} label="Triggered from" active={detail.origin === "frontend"}>
          <div className="space-y-2">
            {detail.triggers.map((t) => (
              <div key={t.component} className="rounded-lg border border-border bg-background/40 px-3 py-2">
                <div className="flex items-center gap-2 text-[0.78125rem] font-medium text-foreground">
                  <Circle size={8} className="fill-primary text-primary" /> {t.element}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.6875rem] text-muted-foreground">
                  <span className="rounded bg-muted px-1.5 py-px text-foreground/70">{t.page}</span>
                  <span className="text-muted-foreground/60">{t.route}</span>
                </div>
                <div className="mt-1 font-mono text-[0.65625rem] text-muted-foreground/70">{t.component}</div>
              </div>
            ))}
          </div>
        </Stage>

        <Arrow />

        <Stage icon={Code2} label="API endpoint" active={false}>
          {detail.api ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge tone={methodTone} className="font-mono">
                  {detail.api.method}
                </Badge>
                <span className="truncate font-mono text-[0.78125rem] font-medium text-foreground">{detail.api.path}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5 font-mono text-[0.6875rem] text-muted-foreground">
                <span className={cn("h-1.5 w-1.5 rounded-full", detail.api.status.startsWith("2") ? "bg-ok" : "bg-danger")} />
                returns {detail.api.status}
              </div>
              <CopyButton text={`${detail.api.method} ${detail.api.path}`} label="Copy endpoint" className="px-0" />
            </div>
          ) : (
            <div className="rounded-lg bg-muted px-3 py-2 text-[0.75rem] text-muted-foreground">No network call — this is a pure client-side render issue.</div>
          )}
        </Stage>

        <Arrow />

        <Stage icon={Layers} label="Backend" active={detail.origin === "backend"}>
          {detail.backend ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge tone="outline" className="font-mono">
                  {detail.backend.service}
                </Badge>
                <span className="font-mono text-[0.6875rem] text-muted-foreground">{detail.backend.runtime}</span>
              </div>
              <div className="rounded-lg border border-border bg-background/40 px-2.5 py-2 font-mono text-[0.71875rem]">
                <div className="truncate text-foreground/85">{detail.backend.file}</div>
                <div className="text-muted-foreground">
                  {detail.backend.handler}() <span className="text-muted-foreground/60">· line {detail.backend.line}</span>
                </div>
              </div>
              {detail.backend.note && <p className="text-[0.71875rem] leading-snug text-muted-foreground">{detail.backend.note}</p>}
            </div>
          ) : (
            <div className="rounded-lg bg-muted px-3 py-2 text-[0.75rem] text-muted-foreground">No backend involved — rendered entirely in the browser.</div>
          )}
        </Stage>
      </div>
    </Card>
  );
}
