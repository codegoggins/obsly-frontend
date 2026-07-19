"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Send, ChevronDown, Check, VolumeX, User, X, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { SearchInput } from "@/components/ui/search-input";
import { RangePicker } from "@/components/ui/range-picker";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheck,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ISSUES } from "@/lib/mock/issues";
import { IssueRow, ROW_GRID } from "@/components/issues/issue-row";

type SortCol = "events" | "users";
type Sort = { col: SortCol; dir: "asc" | "desc" };

const LEVELS = [
  { value: "all", label: "All levels" },
  { value: "error", label: "Errors" },
  { value: "warning", label: "Warnings" },
];

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

export function IssuesView() {
  const [status, setStatus] = useState("unresolved");
  const [level, setLevel] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>({ col: "events", dir: "desc" });
  const [sel, setSel] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let rows = ISSUES.slice();
    if (status !== "all") rows = rows.filter((i) => i.status === status);
    if (level !== "all") rows = rows.filter((i) => i.level === level);
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter((i) => (i.type + i.title + i.culprit + i.id).toLowerCase().includes(q));
    }
    const dir = sort.dir === "desc" ? -1 : 1;
    return rows.sort((a, b) => (a[sort.col] - b[sort.col]) * dir);
  }, [status, level, query, sort]);

  const toggle = (id: string) =>
    setSel((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const allSel = filtered.length > 0 && filtered.every((i) => sel.has(i.id));
  const toggleAll = () => setSel(allSel ? new Set() : new Set(filtered.map((i) => i.id)));

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
          <RangePicker />
          <Button variant="secondary" size="lg">
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
              <Button variant="secondary" size="sm">
                <Check size={13} /> Resolve
              </Button>
              <Button variant="secondary" size="sm">
                <VolumeX size={13} /> Ignore
              </Button>
              <Button variant="secondary" size="sm">
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
    </div>
  );
}
