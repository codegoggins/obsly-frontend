"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import { Search, Check, X, Lock, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GitHubMark } from "@/components/brand-marks";
import { cn } from "@/lib/utils";
import { GITHUB, IMPORTABLE_REPOS } from "@/lib/mock/github";
import type { Project, ProjectPlatform } from "@/lib/mock/projects";

// normalize a repo language into one of our platform labels
function toPlatform(language: string): ProjectPlatform {
  if (language === "Next.js" || language === "React" || language === "Node" || language === "Swift" || language === "Cloudflare") return language;
  return "Node";
}

function makeProject(full: string, language: string): Project {
  const name = full.split("/")[1] ?? full;
  const key = crypto.randomUUID().replace(/-/g, "");
  return {
    id: name,
    name,
    platform: toPlatform(language),
    env: "production",
    status: "healthy",
    repo: full,
    branch: "main",
    dsn: `https://o${key.slice(0, 4)}@ingest.obsly.dev/v1/${name}`,
    apiKey: `obs_live_sk_${key.slice(0, 24)}`,
    events24h: "0",
    errorRate: "0%",
    users: 0,
    members: 1,
    createdAt: "just now",
  };
}

type NewProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (project: Project) => void;
};

export function NewProjectDialog({ open, onOpenChange, onCreate }: NewProjectDialogProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setSearch("");
      setSelected(null);
    }
    onOpenChange(next);
  };

  const repos = IMPORTABLE_REPOS.filter((r) => r.full.toLowerCase().includes(search.toLowerCase()));
  const create = () => {
    const repo = IMPORTABLE_REPOS.find((r) => r.full === selected);
    if (!repo) return;
    onCreate(makeProject(repo.full, repo.language));
    handleOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-90 bg-black/55 backdrop-blur-[2px] transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-100 flex max-h-[calc(100vh-4rem)] w-[calc(100vw-2rem)] max-w-115 -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border border-border bg-popover shadow-2xl outline-none transition-[transform,opacity] duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <div className="flex items-start justify-between gap-4 p-5 pb-3">
            <div>
              <Dialog.Title className="text-[0.9375rem] font-semibold">New project</Dialog.Title>
              <Dialog.Description className="mt-0.5 text-[0.8125rem] text-muted-foreground">
                Import a repository to start monitoring it.
              </Dialog.Description>
            </div>
            <Dialog.Close className="ring-focus -mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <X size={16} />
            </Dialog.Close>
          </div>

          {GITHUB.connected ? (
            <>
              <div className="px-5 pb-3">
                <div className="mb-3 flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-[0.75rem]">
                  <GitHubMark size={15} />
                  <span className="text-muted-foreground">
                    Connected as <span className="font-medium text-foreground">@{GITHUB.account}</span> · {GITHUB.org}
                  </span>
                </div>
                <div className="flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3">
                  <Search size={14} className="text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search repositories…"
                    className="h-full w-full bg-transparent text-[0.8125rem] outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-1.5 overflow-y-auto px-5">
                {repos.map((r) => {
                  const active = selected === r.full;
                  return (
                    <button
                      key={r.full}
                      onClick={() => setSelected(r.full)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors",
                        active ? "border-primary bg-primary/5" : "border-border hover:bg-accent",
                      )}
                    >
                      <GitHubMark size={16} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate font-mono text-[0.78125rem] font-medium">{r.full}</span>
                          {r.private && <Lock size={11} className="shrink-0 text-muted-foreground" />}
                        </div>
                        <div className="text-[0.6875rem] text-muted-foreground">
                          {r.language} · pushed {r.pushedAgo}
                        </div>
                      </div>
                      {active && <Check size={16} className="text-primary" />}
                    </button>
                  );
                })}
                {repos.length === 0 && (
                  <div className="py-8 text-center text-[0.8125rem] text-muted-foreground">No repositories match “{search}”.</div>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t border-border p-4">
                <Button variant="secondary" size="sm" onClick={() => handleOpenChange(false)}>
                  Cancel
                </Button>
                <Button size="sm" disabled={!selected} onClick={create}>
                  Import project
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 px-6 pb-6 pt-2 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-foreground">
                <GitHubMark size={22} />
              </span>
              <div className="text-sm font-semibold">Connect GitHub first</div>
              <p className="max-w-xs text-[0.8125rem] text-muted-foreground">
                Projects are created by importing a repository. Connect your GitHub account on the setup page to continue.
              </p>
              <Button
                size="sm"
                className="mt-1"
                onClick={() => {
                  handleOpenChange(false);
                  router.push("/onboarding");
                }}
              >
                <Rocket size={14} /> Go to setup
              </Button>
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
