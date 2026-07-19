import Link from "next/link";
import { BarChart3, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { AreaChart } from "@/components/ui/area-chart";
import { ERROR_SERIES, ERROR_ANOMALY } from "@/lib/mock/dashboard";

const legend = (
  <div className="flex items-center gap-3 text-[0.6875rem] text-muted-foreground">
    <span className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full bg-danger" /> errors
    </span>
    <span className="flex items-center gap-1.5">
      <Sparkles size={11} className="text-warn" /> anomaly
    </span>
  </div>
);

export function ErrorVolume() {
  return (
    <Card className="p-5 lg:col-span-2">
      <SectionTitle icon={BarChart3} action={legend}>
        Error volume
      </SectionTitle>
      <AreaChart
        data={ERROR_SERIES}
        tone="danger"
        label="errors"
        anomalies={ERROR_ANOMALY}
        xlabels={["00:00", "06:00", "12:00", "18:00", "now"]}
      />
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-warn/20 bg-warn/[0.06] px-3 py-2 text-[0.75rem]">
        <Sparkles size={14} className="shrink-0 text-warn" />
        <span className="text-foreground/85">
          <span className="font-medium">Anomaly at 14:00 —</span> errors jumped 3.1× above the predicted band. Likely cause:{" "}
          <Link href="/issues" className="font-medium text-primary underline-offset-2 hover:underline">
            empty cart on /checkout
          </Link>
          .
        </span>
      </div>
    </Card>
  );
}
