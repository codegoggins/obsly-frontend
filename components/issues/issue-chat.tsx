"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, ArrowUp } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { StreamText } from "@/components/ui/stream-text";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type Msg = { role: "ai" | "user"; text: string };

const SUGGESTIONS = ["Why does this happen?", "How do I fix it?", "Who is affected?", "Is it from a deploy?"];

// canned, keyword-matched answers — stands in for a real streaming model
function answerFor(q: string): string {
  const s = q.toLowerCase();
  if (s.includes("fix") || s.includes("solve"))
    return "The one-line fix is to guard the optional chain: `return subtotal + (cart.summary?.total ?? 0) * taxRate;`. That defaults the total to **0** when `summary` is undefined, so an empty cart renders instead of crashing. I've drafted this as a PR in the **Suggested fix** panel.";
  if (s.includes("who") || s.includes("affected") || s.includes("user"))
    return "**412 shoppers** hit this in the last 4 hours, all on **/checkout** in production. Every one of them emptied their cart right before the crash — so it blocks exactly the users closest to paying.";
  if (s.includes("deploy") || s.includes("release") || s.includes("2.14"))
    return "Yes — it started with release **2.14.0**, which shipped the new promo-code reducer. That reducer's `REMOVE_LAST_ITEM` branch sets `cart.summary` to `undefined`, which is what `computeTotal` chokes on.";
  if (s.includes("why") || s.includes("cause") || s.includes("happen"))
    return "When the **last item** leaves the cart, `REMOVE_LAST_ITEM` sets `cart.summary` to `undefined` instead of an empty summary. `computeTotal()` then reads `cart.summary.total` and throws. The breadcrumbs show a `remove item` click 100ms before every crash.";
  return "Based on 1,248 events, this is a `TypeError` in `CartSummary.computeTotal` triggered by removing the last cart item after release **2.14.0**. Ask about the cause, the fix, who's affected, or the deploy.";
}

type IssueChatProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issueId: string;
};

export function IssueChat({ open, onOpenChange, issueId }: IssueChatProps) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: `I've analyzed **${issueId}**. Ask me anything — why it happens, who's affected, or how to fix it.` },
  ]);
  const [thinking, setThinking] = useState(false);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number>(0);

  // keep the latest message in view (DOM side effect only)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const send = (text: string) => {
    const q = text.trim();
    if (!q || thinking) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setThinking(true);
    timer.current = window.setTimeout(() => {
      setThinking(false);
      setMessages((m) => [...m, { role: "ai", text: answerFor(q) }]);
    }, 900);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        icon={Sparkles}
        title="Ask Obsly"
        subtitle={`About ${issueId}`}
        footer={
          <div className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 focus-within:ring-2 focus-within:ring-ring/30">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask about this issue…"
              className="h-7 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || thinking}
              aria-label="Send"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <ArrowUp size={15} />
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {messages.map((m, i) =>
            m.role === "ai" ? (
              <div key={i} className="flex gap-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Sparkles size={13} />
                </span>
                <div className="min-w-0 flex-1 rounded-lg rounded-tl-sm bg-muted px-3 py-2 text-[0.8125rem] leading-relaxed text-foreground/90">
                  <StreamText text={m.text} />
                </div>
              </div>
            ) : (
              <div key={i} className="flex justify-end">
                <div className="max-w-[85%] rounded-lg rounded-tr-sm bg-primary px-3 py-2 text-[0.8125rem] leading-relaxed text-primary-foreground">
                  {m.text}
                </div>
              </div>
            ),
          )}

          {thinking && (
            <div className="flex items-center gap-2 pl-9 text-[0.75rem] text-muted-foreground">
              <Spinner size={13} /> Obsly is thinking…
            </div>
          )}

          {messages.length <= 1 && !thinking && (
            <div className="flex flex-wrap gap-2 pl-9">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className={cn(
                    "rounded-full border border-border bg-card px-2.5 py-1 text-[0.71875rem] text-foreground/80 transition-colors hover:border-primary/40 hover:bg-primary/5",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <div ref={endRef} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
