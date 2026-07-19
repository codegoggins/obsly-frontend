"use client";

import { useState } from "react";
import { Globe, RefreshCw, Clock, TrendingUp, Dot, Sparkles, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { SearchInput } from "@/components/ui/search-input";
import { StreamText } from "@/components/ui/stream-text";
import { MenuPicker } from "@/components/ui/menu-picker";
import { LiveDot } from "@/components/live-dot";
import { cn } from "@/lib/utils";
import { COUNTERS, GAUGES, TIMINGS, TAG_FILTERS, type Metric } from "@/lib/mock/metrics";
import { MetricCard } from "@/components/metrics/metric-card";
import { ExplainSheet } from "@/components/metrics/explain-sheet";

const RANGES = [
  { value: "1h", label: "1h" },
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
];

const ENVS = [
  { value: "production", label: "Production" },
  { value: "staging", label: "Staging" },
  { value: "all", label: "All envs" },
];

const INSIGHT =
  "`checkout.latency` **spiked 3.2×** at 14:05 — correlated with an error spike on **/checkout** and a growing `queue.depth`. Likely DB pool saturation.";

export function MetricsView() {
  const [range, setRange] = useState("24h");
  const [env, setEnv] = useState("production");
  const [live, setLive] = useState(true);
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [explain, setExplain] = useState<Metric | null>(null);
  const [stripOpen, setStripOpen] = useState(true);
  const [replay, setReplay] = useState(0);

  const toggleTag = (key: string) => setTags((t) => (t.includes(key) ? t.filter((x) => x !== key) : [...t, key]));
  const match = (m: Metric) =>
    m.name.toLowerCase().includes(query.toLowerCase()) && tags.every((t) => m.tags.includes(t));

  const sections = [
    { title: "Timings", icon: Clock, items: TIMINGS.filter(match) },
    { title: "Counters", icon: TrendingUp, items: COUNTERS.filter(match) },
    { title: "Gauges", icon: Dot, items: GAUGES.filter(match) },
  ];
  const empty = sections.every((s) => s.items.length === 0);

  return (
    <div className="mx-auto max-w-295 space-y-5">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[1.375rem] font-bold tracking-tight">Metrics</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Custom time-series · {env} · last {range}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Segmented value={range} onChange={setRange} options={RANGES} />
          <MenuPicker value={env} onChange={setEnv} options={ENVS} icon={Globe} />
          <button
            onClick={() => setLive((l) => !l)}
            className={cn(
              "ring-focus flex h-9 items-center gap-2 rounded-md border px-3 text-[0.8125rem] font-medium transition-colors",
              live ? "border-ok/30 bg-ok/10 text-ok" : "border-border bg-secondary text-muted-foreground",
            )}
          >
            {live ? <LiveDot size={7} /> : <span className="size-1.75 rounded-full bg-muted-foreground/50" />} Live
          </button>
          <Button variant="secondary" size="icon-lg" aria-label="Refresh" onClick={() => setReplay((n) => n + 1)}>
            <RefreshCw size={15} />
          </Button>
        </div>
      </div>

      {/* AI insight strip */}
      {stripOpen && (
        <Card glow className="border-primary/20 px-4 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Sparkles size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <StreamText key={replay} text={INSIGHT} className="text-[0.8125rem] text-foreground/90" />
            </div>
            <button
              onClick={() => setExplain(TIMINGS[0])}
              className="hidden shrink-0 items-center gap-1 text-[0.78125rem] font-medium text-primary hover:underline sm:flex"
            >
              Explain
            </button>
            <button
              onClick={() => setStripOpen(false)}
              aria-label="Dismiss"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent"
            >
              <X size={14} />
            </button>
          </div>
        </Card>
      )}

      {/* filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-full sm:w-65">
          <SearchInput placeholder="Search metrics…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="flex flex-1 flex-wrap items-center gap-1.5">
          {TAG_FILTERS.map((t) => (
            <button
              key={t.key}
              onClick={() => toggleTag(t.key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.71875rem] transition-colors",
                tags.includes(t.key)
                  ? "border-primary/40 bg-primary/12 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-accent",
              )}
            >
              {t.key}
              <span className="text-[0.625rem] opacity-60">{t.count}</span>
            </button>
          ))}
          {tags.length > 0 && (
            <button onClick={() => setTags([])} className="ml-1 text-[0.75rem] text-muted-foreground hover:text-foreground">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* sections */}
      {empty ? (
        <div className="py-16 text-center text-sm text-muted-foreground">No metrics match “{query}”.</div>
      ) : (
        <div className="space-y-7">
          {sections.map(
            (s) =>
              s.items.length > 0 && (
                <section key={s.title}>
                  <SectionTitle icon={s.icon} action={<span className="text-[0.6875rem] text-muted-foreground">{s.items.length} metrics</span>}>
                    {s.title}
                  </SectionTitle>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {s.items.map((m) => (
                      <MetricCard key={m.name} metric={m} onExplain={setExplain} />
                    ))}
                  </div>
                </section>
              ),
          )}
        </div>
      )}

      <ExplainSheet metric={explain} onClose={() => setExplain(null)} />
    </div>
  );
}
