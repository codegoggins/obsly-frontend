"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { eachDayOfInterval, format, parseISO } from "date-fns";
import { Send, ChevronDown, Check, VolumeX, User, X, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { SearchInput } from "@/components/ui/search-input";
import { DateRangeFilter } from "@/components/issues/date-range-filter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheck,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ISSUES } from "@/lib/mock/issues";
import { IssueRow, ROW_GRID } from "@/components/issues/issue-row";
import { ExportDialog } from "@/components/issues/export-dialog";
import { AssignDialog } from "@/components/issues/assign-dialog";

type SortCol = "events" | "users";
type Sort = { col: SortCol; dir: "asc" | "desc" };

const LEVELS = [
  { value: "all", label: "All levels" },
  { value: "error", label: "Errors" },
  { value: "warning", label: "Warnings" },
];

// deterministic day → issue mapping (mock data has no real per-event timestamps)
function issueOnDate(date: string, id: string) {
  const h = [...(date + id)].reduce((a, c) => a + c.charCodeAt(0), 0);
  return h % 3 !== 0;
}

// an issue is in range if it surfaced on any day of the selected window
function issueInRange(from: string, to: string, id: string) {
  return eachDayOfInterval({ start: parseISO(from), end: parseISO(to) }).some((d) => issueOnDate(format(d, "yyyy-MM-dd"), id));
}

function SortHeader({ label, col, sort, setSort }: { label: string; col: SortCol; sort: Sort; setSort: (s: Sort) => void }) {
  const active = sort.col === col;
  return (
    <button
      onClick={() => setSort({ col, dir: active && sort.dir === "desc" ? "asc" : "desc" })}
      className={cn(
        "flex items-center justify-end gap-1 text-[0.6875rem] font-medium uppercase tracking-wide transition-colors hover:text-foreground",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {label}
      <ChevronDown size={11} className={cn("transition-all", active ? "opacity-100" : "opacity-0", active && sort.dir === "asc" && "rotate-180")} />
    </button>
  );
}

export function IssuesView({ from, to }: { from: string | null; to: string | null }) {
  const router = useRouter();
  const [status, setStatus] = useState("unresolved");
  const [level, setLevel] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>({ col: "events", dir: "desc" });
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [exportOpen, setExportOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignDraft, setAssignDraft] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ title: string; description: React.ReactNode; confirmLabel: string; destructive?: boolean; onConfirm: () => void } | null>(null);

  const filtered = useMemo(() => {
    let rows = ISSUES.slice();
    if (status !== "all") rows = rows.filter((i) => i.status === status);
    if (level !== "all") rows = rows.filter((i) => i.level === level);
    if (from) rows = rows.filter((i) => issueInRange(from, to ?? from, i.id));
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter((i) => (i.type + i.title + i.culprit + i.id).toLowerCase().includes(q));
    }
    const dir = sort.dir === "desc" ? -1 : 1;
    return rows.sort((a, b) => (a[sort.col] - b[sort.col]) * dir);
  }, [status, level, query, sort, from, to]);

  const toggle = (id: string) =>
    setSel((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const allSel = filtered.length > 0 && filtered.every((i) => sel.has(i.id));
  const toggleAll = () => setSel(allSel ? new Set() : new Set(filtered.map((i) => i.id)));

  const bulkNoun = (n: number) => (n === 1 ? "issue" : "issues");
  const askBulkResolve = () =>
    setConfirm({
      title: "Resolve issues",
      description: <>Mark {sel.size} selected {bulkNoun(sel.size)} as resolved?</>,
      confirmLabel: "Resolve",
      onConfirm: () => setSel(new Set()),
    });
  const askBulkIgnore = () =>
    setConfirm({
      title: "Ignore issues",
      description: <>Ignore {sel.size} selected {bulkNoun(sel.size)}? You&apos;ll stop getting alerts for them.</>,
      confirmLabel: "Ignore",
      destructive: true,
      onConfirm: () => setSel(new Set()),
    });

  const counts = useMemo(() => {
    const unres = ISSUES.filter((i) => i.status === "unresolved");
    return {
      unresolved: unres.length,
      errors: unres.filter((i) => i.level === "error").length,
      warnings: unres.filter((i) => i.level === "warning").length,
      users: unres.reduce((a, i) => a + i.users, 0),
    };
  }, []);

  const summary = [
    { l: "Unresolved", v: counts.unresolved, s: "across 4 projects", tone: "" },
    { l: "Errors", v: counts.errors, s: "need attention", tone: "text-danger" },
    { l: "Warnings", v: counts.warnings, s: "lower severity", tone: "text-warn" },
    { l: "Users affected", v: counts.users.toLocaleString(), s: "unique, 24h", tone: "" },
  ];

  const curLevel = LEVELS.find((l) => l.value === level) ?? LEVELS[0];

  return (
    <div className="mx-auto max-w-295 space-y-5">
      {/* head */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[1.375rem] font-bold tracking-tight">Issues</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">web-storefront · production · grouped by fingerprint</p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangeFilter
            from={from}
            to={to}
            onChange={(range) => router.push(range ? `/issues?from=${range.from}&to=${range.to}` : "/issues")}
          />
          <Button variant="secondary" size="lg" onClick={() => setExportOpen(true)}>
            <Send size={14} /> Export
          </Button>
        </div>
      </div>

      {/* summary strip */}
      <Card className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
        {summary.map((s) => (
          <div key={s.l} className="px-4 py-3">
            <div className="text-[0.6875rem] uppercase tracking-wide text-muted-foreground">{s.l}</div>
            <div className={cn("mt-1 font-mono text-[1.25rem] font-semibold", s.tone)}>{s.v}</div>
            <div className="text-[0.6875rem] text-muted-foreground">{s.s}</div>
          </div>
        ))}
      </Card>

      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <Segmented
          value={status}
          onChange={(v) => {
            setStatus(v);
            setSel(new Set());
          }}
          options={[
            { value: "unresolved", label: "Unresolved" },
            { value: "resolved", label: "Resolved" },
            { value: "all", label: "All" },
          ]}
        />
        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: "secondary", size: "lg" })}>
            {curLevel.label} <ChevronDown size={13} className="text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {LEVELS.map((l) => (
              <DropdownMenuCheck key={l.value} checked={l.value === level} onClick={() => setLevel(l.value)}>
                {l.label}
              </DropdownMenuCheck>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="ml-auto w-full sm:w-70">
          <SearchInput placeholder="Search type, message, file…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {/* bulk actions */}
      <AnimatePresence>
        {sel.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/[0.07] px-3 py-2"
          >
            <span className="text-[0.78125rem] font-medium">{sel.size} selected</span>
            <div className="ml-auto flex items-center gap-1.5">
              <Button variant="secondary" size="sm" onClick={askBulkResolve}>
                <Check size={13} /> Resolve
              </Button>
              <Button variant="secondary" size="sm" onClick={askBulkIgnore}>
                <VolumeX size={13} /> Ignore
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setAssignDraft(null);
                  setAssignOpen(true);
                }}
              >
                <User size={13} /> Assign
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setSel(new Set())}>
                <X size={13} /> Clear
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-4xl">
            {/* header row */}
            <div className={cn(ROW_GRID, "border-b border-border bg-muted/30 px-3 py-2.5")}>
              <label className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={allSel}
                  onChange={toggleAll}
                  className="h-3.5 w-3.5 cursor-pointer rounded border-border bg-card accent-primary"
                />
              </label>
              <span className="text-[0.6875rem] font-medium uppercase tracking-wide text-muted-foreground">Issue</span>
              <span className="text-center text-[0.6875rem] font-medium uppercase tracking-wide text-muted-foreground">Trend</span>
              <div className="flex justify-end">
                <SortHeader label="Events" col="events" sort={sort} setSort={setSort} />
              </div>
              <div className="flex justify-end">
                <SortHeader label="Users" col="users" sort={sort} setSort={setSort} />
              </div>
              <span className="text-right text-[0.6875rem] font-medium uppercase tracking-wide text-muted-foreground">Last seen</span>
              <span className="text-right text-[0.6875rem] font-medium uppercase tracking-wide text-muted-foreground">Status</span>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-14 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Check size={20} />
                </span>
                <div className="text-[0.84375rem] font-medium">No issues match</div>
                <div className="text-[0.75rem] text-muted-foreground">Try a different filter or search term.</div>
              </div>
            ) : (
              filtered.map((issue) => (
                <IssueRow key={issue.id} issue={issue} selected={sel.has(issue.id)} onToggle={() => toggle(issue.id)} />
              ))
            )}
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between text-[0.75rem] text-muted-foreground">
        <span>
          Showing {filtered.length} of {ISSUES.length} issues
        </span>
        <span className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-primary" /> Sorted by AI relevance is available in settings
        </span>
      </div>

      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} scopeLabel={`${sel.size || filtered.length} issues`} />
      <AssignDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        subtitle={`Assign ${sel.size} selected ${bulkNoun(sel.size)}.`}
        value={assignDraft}
        onChange={setAssignDraft}
        onSave={() => {
          setAssignOpen(false);
          setSel(new Set());
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
