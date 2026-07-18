"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { LayoutDashboard, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="brand-glow pointer-events-none absolute inset-0" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="bg-linear-to-b from-primary to-primary/30 bg-clip-text font-mono text-[7rem] font-bold leading-none tracking-tighter text-transparent sm:text-[10rem]">
          404
        </div>
        <div className="mt-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.3em] text-primary">
          Page not found
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          This page slipped past our monitors
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Even Obsly couldn&apos;t catch this one. The page you&apos;re looking for doesn&apos;t
          exist, moved, or never shipped.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="ring-focus inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <LayoutDashboard size={16} /> Back to dashboard
          </Link>
          <Link
            href="/login"
            className="ring-focus inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-card px-5 text-sm font-medium transition-colors hover:bg-accent"
          >
            <ArrowLeft size={16} /> Sign in
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
