"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Bug, GitBranch, Trash2, RefreshCw, Link2, KeyRound, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/section-title";
import { AreaChart } from "@/components/ui/area-chart";
import { LiveDot } from "@/components/live-dot";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CopyField } from "@/components/setup/copy-field";
import { Avatar } from "@/components/settings/setting-row";
import { GitHubMark } from "@/components/brand-marks";
import { PLATFORM_ICONS, FALLBACK_ICON } from "@/components/projects/platform-icon";
import { getProject } from "@/lib/mock/projects";
import { MEMBERS } from "@/lib/mock/settings";
import { series } from "@/lib/series";

export function ProjectDetailView({ id }: { id: string }) {
  const router = useRouter();
  const project = getProject(id);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const seed = useMemo(() => [...id].reduce((a, c) => a + c.charCodeAt(0), 0), [id]);
  const events = useMemo(() => series(40, 60, 40, seed), [seed]);

  if (!project) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <div className="text-lg font-semibold">Project not found</div>
        <Link href="/projects" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
          ← Back to projects
        </Link>
      </div>
    );
  }

  const Icon = PLATFORM_ICONS[project.platform] ?? FALLBACK_ICON;
  const members = MEMBERS.filter((m) => m.projects.includes(project.id));

  return (
    <div className="mx-auto max-w-295 space-y-5">
      {/* breadcrumb */}
      <div className="flex items-center gap-1.5 text-[0.78125rem] text-muted-foreground">
        <Link href="/projects" className="hover:text-foreground">
          Projects
        </Link>
        <ChevronRight size={13} />
        <span className="font-mono text-foreground">{project.name}</span>
      </div>

      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
            <Icon size={22} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-[1.25rem] font-semibold tracking-tight">{project.name}</h1>
              <LiveDot tone={project.status === "healthy" ? "ok" : "warn"} />
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[0.75rem] text-muted-foreground">
              <span>{project.platform}</span>
              <Badge tone="outline" className="font-mono">
                {project.env}
              </Badge>
              <span>· created {project.createdAt}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/issues" className="inline-flex">
            <Button variant="secondary">
              <Bug size={14} /> View issues
            </Button>
          </Link>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 size={14} /> Delete
          </Button>
        </div>
      </div>

      {/* stat strip */}
      <Card className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
        {[
          { l: "Events 24h", v: project.events24h },
          { l: "Error rate", v: project.errorRate },
          { l: "Users", v: project.users.toLocaleString() },
          { l: "Members", v: project.members },
        ].map((s) => (
          <div key={s.l} className="px-4 py-3">
            <div className="text-[0.6875rem] uppercase tracking-wide text-muted-foreground">{s.l}</div>
            <div className="mt-1 font-mono text-[1.125rem] font-semibold">{s.v}</div>
          </div>
        ))}
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {/* credentials */}
          <Card className="p-5">
            <SectionTitle
              icon={KeyRound}
              action={
                <Button variant="secondary" size="sm">
                  <RefreshCw size={13} /> Rotate keys
                </Button>
              }
            >
              Credentials
            </SectionTitle>
            <p className="-mt-1.5 mb-4 text-[0.75rem] text-muted-foreground">
              These are unique to <span className="font-medium text-foreground">{project.name}</span> — every project gets
              its own DSN and API key.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <CopyField label="DSN" value={project.dsn} />
              <CopyField label="API key" value={project.apiKey} secret />
            </div>
          </Card>

          {/* events chart */}
          <Card className="p-5">
            <SectionTitle icon={Bug}>Event volume</SectionTitle>
            <AreaChart data={events} tone="brand" label="events" height={160} xlabels={["00:00", "06:00", "12:00", "18:00", "now"]} />
          </Card>
        </div>

        <div className="space-y-4">
          {/* repository */}
          <Card className="p-5">
            <SectionTitle icon={Link2}>Repository</SectionTitle>
            {project.repo ? (
              <div className="rounded-lg border border-ok/30 bg-ok/4 p-3">
                <div className="flex items-center gap-2">
                  <GitHubMark size={16} />
                  <span className="truncate font-mono text-[0.78125rem] font-medium">{project.repo}</span>
                  <Badge tone="ok" dot className="ml-auto">
                    linked
                  </Badge>
                </div>
                <div className="mt-2 flex items-center gap-1.5 border-t border-border pt-2 font-mono text-[0.6875rem] text-muted-foreground">
                  <GitBranch size={11} /> {project.branch}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-3 text-center">
                <p className="text-[0.75rem] text-muted-foreground">No repository linked yet.</p>
                <Link href="/onboarding" className="mt-2 inline-block text-[0.75rem] font-medium text-primary hover:underline">
                  Connect a repo
                </Link>
              </div>
            )}
          </Card>

          {/* members */}
          <Card className="p-5">
            <SectionTitle icon={Users} action={<span className="text-[0.6875rem] text-muted-foreground">{members.length}</span>}>
              Members
            </SectionTitle>
            <div className="space-y-2.5">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-2.5">
                  <Avatar initials={m.initials} tone={m.tone} size={28} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[0.78125rem] font-medium">{m.name}</div>
                    <div className="truncate text-[0.65625rem] text-muted-foreground">{m.role}</div>
                  </div>
                </div>
              ))}
              {members.length === 0 && <p className="text-[0.75rem] text-muted-foreground">No members assigned.</p>}
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete project"
        description={
          <>
            Permanently delete <span className="font-medium text-foreground">{project.name}</span>, its events, and its
            credentials? This cannot be undone.
          </>
        }
        confirmLabel="Delete project"
        destructive
        requireText={project.name}
        onConfirm={() => router.push("/projects")}
      />
    </div>
  );
}
