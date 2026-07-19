import { Bug, Flame, Clock, Zap, type LucideIcon } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { OverviewToolbar } from "@/components/overview/overview-toolbar";
import { AiHero } from "@/components/overview/ai-hero";
import { ErrorVolume } from "@/components/overview/error-volume";
import { TopIssues } from "@/components/overview/top-issues";
import { IssueFrequency } from "@/components/overview/issue-frequency";
import { Insights } from "@/components/overview/insights";
import { ProjectHealth } from "@/components/overview/project-health";
import { KPIS, type Kpi } from "@/lib/mock/dashboard";

export const metadata = { title: "Overview" };

const KPI_ICONS: Record<Kpi["icon"], LucideIcon> = { bug: Bug, flame: Flame, clock: Clock, zap: Zap };

export default function OverviewPage() {
  return (
    <div className="mx-auto max-w-295 space-y-5">
      {/* page head */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[1.375rem] font-bold tracking-tight">Overview</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">web-storefront · production · last 24 hours</p>
        </div>
        <OverviewToolbar />
      </div>

      <AiHero />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPIS.map((kpi) => (
          <StatCard
            key={kpi.label}
            icon={KPI_ICONS[kpi.icon]}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            deltaGood={kpi.deltaGood}
            sub={kpi.sub}
            tone={kpi.tone}
            spark={kpi.spark}
          />
        ))}
      </div>

      {/* error volume + top issues */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ErrorVolume />
        <TopIssues />
      </div>

      <IssueFrequency />

      {/* AI insights + project health */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Insights />
        <ProjectHealth />
      </div>
    </div>
  );
}
