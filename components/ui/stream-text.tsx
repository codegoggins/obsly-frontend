"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// renders markdown-lite (**bold** and `code`) as react nodes
function renderMd(text: string, keyBase: string) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyBase}-${i}`} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={`${keyBase}-${i}`} className="rounded bg-primary/12 px-1 py-0.5 font-mono text-[0.85em] text-primary">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={`${keyBase}-${i}`}>{part}</span>;
  });
}

type StreamTextProps = {
  text: string;
  speed?: number; // characters revealed per tick
  className?: string;
};

// types text out on mount; remount with a `key` to replay
export function StreamText({ text, speed = 4, className }: StreamTextProps) {
  const [count, setCount] = useState(0);
  const done = count >= text.length;

  useEffect(() => {
    if (done) return;
    const id = window.setInterval(() => {
      setCount((c) => Math.min(text.length, c + speed));
    }, 16);
    return () => window.clearInterval(id);
  }, [text.length, speed, done]);

  // hide a dangling ** or ` marker so partial markdown never flashes raw
  let shown = text.slice(0, count);
  if (!done) {
    if ((shown.match(/\*\*/g) || []).length % 2) shown = shown.replace(/\*\*(?![\s\S]*\*\*)/, "");
    if ((shown.match(/`/g) || []).length % 2) shown = shown.replace(/`(?![\s\S]*`)/, "");
  }

  return (
    <p className={cn("leading-relaxed", className)}>
      {renderMd(shown, "s")}
      {!done && <span className="ml-0.5 inline-block h-[1.05em] w-0.5 translate-y-0.5 animate-pulse bg-primary align-middle" />}
    </p>
  );
}
