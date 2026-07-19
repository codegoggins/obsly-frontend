"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Check, RefreshCw, VolumeX, Sparkles, Download, Globe, Rocket, LineChart, Layers, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/section-title";
import { AreaChart } from "@/components/ui/area-chart";
import { LiveDot } from "@/components/live-dot";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Avatar } from "@/components/settings/setting-row";
import { PlainEnglish } from "@/components/issues/plain-english";
import { AiRootCause } from "@/components/issues/ai-root-cause";
import { RequestPath } from "@/components/issues/request-path";
import { StackTrace } from "@/components/issues/stack-trace";
import { Breadcrumbs } from "@/components/issues/breadcrumbs";
import { IssueChat } from "@/components/issues/issue-chat";
import { ExportDialog } from "@/components/issues/export-dialog";
import { AssignDialog } from "@/components/issues/assign-dialog";
import { ISSUES } from "@/lib/mock/issues";
import { getIssueDetail, occurrences } from "@/lib/mock/issue-detail";
import { MEMBERS } from "@/lib/mock/settings";

const TAGS = ["os:macOS", "device:desktop", "plan:pro", "region:us-east", "feature:promo-codes"];

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 text-[0.78125rem]">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{children}</span>
    </div>
  );
}

export function IssueDetailView({ id }: { id: string }) {
  const issue = ISSUES.find((i) => i.id === id);
  const [status, setStatus] = useState(issue?.status ?? "unresolved");
  const [ignored, setIgnored] = useState(false);
  const [assignee, setAssignee] = useState<string | null>(issue?.assignee ?? null);
  const [assignDraft, setAssignDraft] = useState<string | null>(assignee);
  const [assignOpen, setAssignOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [confirm, setConfirm] = useState<{ title: string; description: React.ReactNode; confirmLabel: string; destructive?: boolean; onConfirm: () => void } | null>(null);

  const seed = useMemo(() => [...(issue?.id ?? "0")].reduce((a, c) => a + c.charCodeAt(0), 0), [issue?.id]);
  const occ = useMemo(() => occurrences(seed), [seed]);

  if (!issue) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <div className="text-lg font-semibold">Issue not found</div>
        <p className="mt-1 text-sm text-muted-foreground">We couldn&apos;t find an issue with id {id}.</p>
        <Link href="/issues" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
          ← Back to issues
        </Link>
      </div>
    );
  }

  const detail = getIssueDetail(issue.id);
  const assignedMember = assignee ? MEMBERS.find((m) => m.id === assignee) : null;
  const resolved = status === "resolved";

  const askResolve = () =>
    setConfirm({
      title: "Resolve issue",
      description: <>Mark <span className="font-medium text-foreground">{issue.id}</span> as resolved? Obsly will reopen it automatically if it happens again.</>,
      confirmLabel: "Resolve",
      onConfirm: () => setStatus("resolved"),
    });

  const askIgnore = () =>
    setConfirm({
      title: "Ignore issue",
      description: <>Ignore <span className="font-medium text-foreground">{issue.id}</span>? You&apos;ll stop getting alerts for it, but events keep being counted.</>,
      confirmLabel: "Ignore",
      destructive: true,
      onConfirm: () => setIgnored(true),
    });

  return (
    <div className="mx-auto max-w-295 space-y-5">
      {/* breadcrumb */}
      <div className="flex items-center gap-1.5 text-[0.78125rem] text-muted-foreground">
        <Link href="/issues" className="hover:text-foreground">
          Issues
        </Link>
        <ChevronRight size={13} />
        <span className="font-mono text-foreground">{issue.id}</span>
      </div>

      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge tone={issue.level === "error" ? "error" : "warn"} dot>
              {issue.level}
            </Badge>
            {resolved ? (
              <Badge tone="ok" dot>
                resolved
              </Badge>
            ) : (
              <Badge tone="outline" dot>
                unresolved
              </Badge>
            )}
            {ignored && <Badge tone="muted">ignored</Badge>}
            <Badge tone="outline" className="font-mono">
              {issue.id}
            </Badge>
            <Badge tone="outline">
              <Globe size={11} /> {issue.env}
            </Badge>
            <Badge tone="outline">
              <Rocket size={11} /> {issue.release}
            </Badge>
            {!issue.handled && <Badge tone="error">unhandled</Badge>}
          </div>
          <h1 className="font-mono text-[1.1875rem] font-semibold leading-snug tracking-tight text-foreground">{issue.title}</h1>
          <p className="mt-1 font-mono text-[0.78125rem] text-muted-foreground">{issue.culprit}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => setChatOpen(true)}>
            <Sparkles size={15} /> Ask AI
          </Button>
          {resolved ? (
            <Button variant="secondary" onClick={() => setStatus("unresolved")}>
              <RefreshCw size={14} /> Unresolve
            </Button>
          ) : (
            <Button variant="ok" onClick={askResolve}>
              <Check size={15} /> Resolve
            </Button>
          )}
          <Button variant="secondary" onClick={askIgnore} disabled={ignored}>
            <VolumeX size={14} /> {ignored ? "Ignored" : "Ignore"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setAssignDraft(assignee);
              setAssignOpen(true);
            }}
          >
            {assignedMember ? <Avatar initials={assignedMember.initials} tone={assignedMember.tone} size={18} /> : <Avatar initials="?" tone="bg-muted text-muted-foreground" size={18} />}
            {assignedMember ? assignedMember.name.split(" ")[0] : "Assign"}
          </Button>
          <Button variant="secondary" size="icon" aria-label="Export" onClick={() => setExportOpen(true)}>
            <Download size={15} />
          </Button>
        </div>
      </div>

      {/* stat strip */}
      <Card className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
        {[
          { l: "Events", v: issue.events.toLocaleString(), s: <span className="text-danger">+{issue.trend}% 24h</span> },
          { l: "Users affected", v: issue.users.toLocaleString(), s: "unique" },
          { l: "First seen", v: issue.firstSeen, s: `release ${issue.release}` },
          {
            l: "Last seen",
            v: (
              <span className="flex items-center justify-end gap-1.5">
                <LiveDot tone="danger" size={6} /> {issue.lastSeen}
              </span>
            ),
            s: "still active",
          },
        ].map((s) => (
          <div key={s.l} className="px-4 py-3">
            <div className="text-[0.6875rem] uppercase tracking-wide text-muted-foreground">{s.l}</div>
            <div className="mt-1 font-mono text-[1.125rem] font-semibold">{s.v}</div>
            <div className="text-[0.6875rem] text-muted-foreground">{s.s}</div>
          </div>
        ))}
      </Card>

      <PlainEnglish detail={detail} />
      <AiRootCause />
      <RequestPath detail={detail} />

      {/* stack + breadcrumbs / right rail */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <StackTrace />
          <Breadcrumbs />
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <SectionTitle icon={LineChart}>Occurrences</SectionTitle>
            <AreaChart data={occ} tone="danger" label="events" height={140} xlabels={["00:00", "06:00", "12:00", "18:00", "now"]} anomalies={[{ i: 30 }]} />
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3 text-[0.75rem]">
              <div>
                <div className="text-muted-foreground">24h</div>
                <div className="font-mono text-[0.9375rem] font-semibold text-danger">+{issue.trend}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Peak / min</div>
                <div className="font-mono text-[0.9375rem] font-semibold">38</div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle icon={Layers}>Details</SectionTitle>
            <div className="divide-y divide-border">
              <DetailRow label="Handled">{issue.handled ? <Badge tone="ok">handled</Badge> : <Badge tone="error">unhandled</Badge>}</DetailRow>
              <DetailRow label="Assignee">{assignedMember ? assignedMember.name : <span className="text-muted-foreground">Unassigned</span>}</DetailRow>
              <DetailRow label="Environment">
                <span className="font-mono">{issue.env}</span>
              </DetailRow>
              <DetailRow label="Release">
                <span className="font-mono">{issue.release}</span>
              </DetailRow>
              <DetailRow label="Origin">
                <span className="capitalize">{detail.origin}</span>
              </DetailRow>
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle icon={Tag}>Tags</SectionTitle>
            <div className="flex flex-wrap gap-1.5">
              {TAGS.map((t) => (
                <Badge key={t} tone="muted" className="font-mono">
                  {t}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <IssueChat open={chatOpen} onOpenChange={setChatOpen} issueId={issue.id} />
      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} scopeLabel={issue.id} />
      <AssignDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        subtitle={`Assign ${issue.id} to a teammate.`}
        value={assignDraft}
        onChange={setAssignDraft}
        onSave={() => {
          setAssignee(assignDraft);
          setAssignOpen(false);
        }}
      />
      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(o) => !o && setConfirm(null)}
        title={confirm?.title ?? ""}
        description={confirm?.description}
        confirmLabel={confirm?.confirmLabel ?? "Confirm"}
        destructive={confirm?.destructive}
        onConfirm={() => confirm?.onConfirm()}
      />
    </div>
  );
}
