"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles, TrendingUp, Clock, User, Check, ArrowRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { cn } from "@/lib/utils";
import { INSIGHTS, type Insight } from "@/lib/mock/dashboard";

const ICONS: Record<Insight["icon"], LucideIcon> = { trend: TrendingUp, clock: Clock, user: User, check: Check };
const TEXT = { danger: "text-danger", warn: "text-warn", brand: "text-primary" };
const BORDER = { danger: "border-danger/20", warn: "border-warn/20", brand: "border-primary/20" };

export function Insights() {
  return (
    <div className="space-y-4 lg:col-span-2">
      <SectionTitle icon={Sparkles}>AI insights</SectionTitle>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {INSIGHTS.map((insight, i) => {
          const Icon = ICONS[insight.icon];
          return (
            <motion.div
              key={insight.title}
              className="h-full"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              <Card className={cn("h-full p-4", BORDER[insight.tone])}>
                <div className="flex items-start gap-3">
                  <span className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted", TEXT[insight.tone])}>
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[0.8125rem] font-semibold leading-snug">{insight.title}</div>
                    <p className="mt-1 text-[0.75rem] leading-relaxed text-muted-foreground">{insight.body}</p>
                    <Link
                      href={insight.href}
                      className={cn("mt-2 inline-flex items-center gap-1 text-[0.75rem] font-medium", TEXT[insight.tone])}
                    >
                      {insight.cta} <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
