"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const TONE = {
  ok: "var(--ok)",
  warn: "var(--warn)",
  danger: "var(--danger)",
};

type LiveDotProps = {
  tone?: keyof typeof TONE;
  size?: number;
  className?: string;
};

// ripple dot: a solid center with an expanding ring looping behind it
export function LiveDot({ tone = "ok", size = 8, className }: LiveDotProps) {
  const color = `hsl(${TONE[tone]})`;
  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ background: color }}
        animate={{ scale: [1, 1, 2.4], opacity: [0, 0.5, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
          times: [0, 0.2, 1],
        }}
      />
      <span
        className="relative rounded-full"
        style={{ width: size, height: size, background: color }}
      />
    </span>
  );
}
