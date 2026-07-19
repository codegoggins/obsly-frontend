import { Bug, Flame, Clock, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Overview" };

const KPIS = [
  { label: "Errors (24h)", value: "3,142", icon: Bug },
  { label: "Error rate", value: "1.7%", icon: Flame },
  { label: "P95 latency", value: "842ms", icon: Clock },
  { label: "Apdex", value: "0.94", icon: Zap },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-[1.375rem] font-bold tracking-tight">Overview</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          web-storefront · production · last 24 hours
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPIS.map((kpi) => (
          <Card key={kpi.label} className="p-4">
            <div className="flex items-center gap-2 text-[0.78125rem] font-medium text-muted-foreground">
              <kpi.icon size={14} /> {kpi.label}
            </div>
            <div className="mt-2 font-mono text-[1.625rem] font-semibold tracking-tight">
              {kpi.value}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="text-sm font-semibold">Error volume</div>
          <div className="mt-4 flex h-52 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
            Chart coming soon
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-semibold">Top issues</div>
          <div className="mt-4 flex h-52 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
            Issues list coming soon
          </div>
        </Card>
      </div>
    </div>
  );
}
