"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles, ArrowRight, LayoutGrid, Bug, LineChart, Rocket, Settings } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const SUGGESTIONS = [
  "Why did errors spike at 2pm?",
  "Show me checkout errors today",
  "Which release is the most unstable?",
  "P95 latency for checkout-api this week",
];

const NAV = [
  { label: "Go to Dashboard", href: "/", kbd: "D", icon: LayoutGrid },
  { label: "Open Issues", href: "/issues", kbd: "I", icon: Bug },
  { label: "Open Metrics", href: "/metrics", kbd: "M", icon: LineChart },
  { label: "Project setup", href: "/onboarding", kbd: "P", icon: Rocket },
  { label: "Settings", href: "/settings", kbd: ",", icon: Settings },
];

const ANSWER = {
  text: "**142 checkout errors** today across 3 issues — up **212%** vs yesterday. The spike traces to **OBS-4821** (TypeError in CartSummary), which alone accounts for 88% of them and began at 14:00 with release **2.14.0**.",
  chips: [
    { label: "Open OBS-4821", href: "/issues" },
    { label: "View all checkout issues", href: "/issues" },
  ],
};

function renderBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

type Phase = "idle" | "thinking" | "answered";

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<number>(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 20);
    } else {
      window.clearTimeout(timer.current);
      setQuery("");
      setPhase("idle");
    }
  }, [open]);

  const ask = (text: string) => {
    setQuery(text);
    setPhase("thinking");
    timer.current = window.setTimeout(() => setPhase("answered"), 1000);
  };

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const isQuestion = query.trim().length > 0 && (query.includes("?") || query.trim().split(" ").length > 2);
  const filteredNav = NAV.filter((n) => n.label.toLowerCase().includes(query.toLowerCase()));

  const overlay = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />

          <div className="pointer-events-none absolute inset-0 flex items-start justify-center px-4 pt-[12vh]">
            <motion.div
              className="pointer-events-auto relative w-full max-w-160 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 border-b border-border px-4">
                <Sparkles size={18} className="text-primary" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPhase("idle");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && isQuestion) ask(query);
                  }}
                  placeholder="Ask Obsly anything, or jump to…"
                  className="h-14 flex-1 bg-transparent text-[0.9375rem] outline-none placeholder:text-muted-foreground/70"
                />
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.625rem] text-muted-foreground">
                  esc
                </kbd>
              </div>

              <div className="max-h-[52vh] overflow-y-auto p-2">
                {phase === "thinking" && (
                  <div className="px-2 py-3">
                    <div className="mb-2 flex items-center gap-2 text-[0.75rem] font-medium text-primary">
                      <Spinner size={13} /> Obsly is thinking…
                    </div>
                    <motion.div
                      className="space-y-2"
                      animate={{ opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="h-3 w-[92%] rounded bg-muted" />
                      <div className="h-3 w-[78%] rounded bg-muted" />
                      <div className="h-3 w-[60%] rounded bg-muted" />
                    </motion.div>
                  </div>
                )}

                {phase === "answered" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-lg border border-primary/20 bg-primary/5 p-3.5"
                  >
                    <div className="mb-1.5 flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-wide text-primary">
                      <Sparkles size={12} /> Obsly
                    </div>
                    <p className="text-[0.84375rem] leading-relaxed text-foreground/90">
                      {renderBold(ANSWER.text)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {ANSWER.chips.map((c) => (
                        <button
                          key={c.label}
                          onClick={() => go(c.href)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-[0.75rem] font-medium transition-colors hover:border-primary/40 hover:bg-primary/5"
                        >
                          {c.label} <ArrowRight size={12} className="text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {phase === "idle" && (
                  <>
                    {isQuestion && (
                      <button
                        onClick={() => ask(query)}
                        className="mb-1 flex w-full items-center gap-3 rounded-lg bg-primary/10 px-3 py-2.5 text-left transition-colors hover:bg-primary/15"
                      >
                        <Sparkles size={16} className="text-primary" />
                        <span className="text-[0.84375rem] text-foreground">
                          Ask Obsly: <span className="font-medium">&ldquo;{query}&rdquo;</span>
                        </span>
                        <kbd className="ml-auto rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[0.625rem] text-muted-foreground">
                          ↵
                        </kbd>
                      </button>
                    )}

                    {!query && (
                      <div className="px-2 pb-1 pt-2">
                        <div className="mb-2 text-[0.65625rem] font-semibold uppercase tracking-wider text-muted-foreground/70">
                          Ask Obsly
                        </div>
                        <div className="space-y-0.5">
                          {SUGGESTIONS.map((s) => (
                            <button
                              key={s}
                              onClick={() => ask(s)}
                              className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-[0.8125rem] text-foreground/85 transition-colors hover:bg-accent"
                            >
                              <Sparkles size={14} className="text-primary/70" /> {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {!isQuestion && filteredNav.length > 0 && (
                      <div className="px-2 pb-1 pt-2">
                        <div className="mb-2 text-[0.65625rem] font-semibold uppercase tracking-wider text-muted-foreground/70">
                          Navigate
                        </div>
                        <div className="space-y-0.5">
                          {filteredNav.map((n) => (
                            <button
                              key={n.href}
                              onClick={() => go(n.href)}
                              className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-[0.8125rem] text-foreground/85 transition-colors hover:bg-accent"
                            >
                              <n.icon size={15} className="text-muted-foreground" /> {n.label}
                              <kbd className="ml-auto rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.625rem] text-muted-foreground">
                                {n.kbd}
                              </kbd>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border px-3 py-2 text-[0.6875rem] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={12} className="text-primary" /> Powered by Obsly AI
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <kbd className="rounded border border-border bg-muted px-1">↵</kbd> select
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="ring-focus flex h-9 w-full max-w-104 items-center gap-2.5 rounded-lg border border-border bg-card px-3 text-left text-[0.8125rem] text-muted-foreground transition-colors hover:bg-accent"
      >
        <Sparkles size={15} className="shrink-0 text-primary" />
        <span className="truncate">Ask Obsly anything…</span>
        <kbd className="ml-auto rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.625rem]">
          ⌘K
        </kbd>
      </button>

      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
