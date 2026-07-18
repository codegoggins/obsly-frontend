"use client";

import { motion } from "motion/react";

// shared heading + body wrapper for every auth screen
type AuthCardProps = {
  eyebrow: string;
  title: string;
  sub: string;
  children: React.ReactNode;
};

export function AuthCard({ eyebrow, title, sub, children }: AuthCardProps) {
  return (
    <motion.div
      className="w-full max-w-100 space-y-6"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div>
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </div>
        <h1 className="text-[1.625rem] font-bold leading-tight tracking-tight">{title}</h1>
        <p className="mt-2 text-[0.84375rem] leading-relaxed text-muted-foreground">{sub}</p>
      </div>
      {children}
    </motion.div>
  );
}
