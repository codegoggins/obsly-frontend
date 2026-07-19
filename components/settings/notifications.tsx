"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SettingRow } from "@/components/settings/setting-row";

const ALERTS = [
  { key: "errors", label: "New error issues", hint: "A brand-new issue is seen in production" },
  { key: "anomalies", label: "AI anomaly alerts", hint: "Obsly detects a metric anomaly or spike" },
  { key: "resolved", label: "Regression / re-opened", hint: "A resolved issue starts happening again" },
  { key: "deploys", label: "Deploy summaries", hint: "Health report after each release" },
  { key: "digest", label: "Weekly digest", hint: "Monday morning rollup email" },
];

export function Notifications() {
  const [on, setOn] = useState<Record<string, boolean>>({
    errors: true,
    anomalies: true,
    resolved: true,
    deploys: false,
    digest: false,
  });
  const toggle = (key: string) => (checked: boolean) => setOn((o) => ({ ...o, [key]: checked }));

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">Notifications</h2>
        <p className="text-[0.78125rem] text-muted-foreground">Choose what Obsly pings you about.</p>
      </div>

      <Card className="p-5">
        {ALERTS.map((a) => (
          <SettingRow key={a.key} label={a.label} hint={a.hint}>
            <Switch checked={on[a.key]} onCheckedChange={toggle(a.key)} />
          </SettingRow>
        ))}
      </Card>

      <Card className="p-5">
        <h3 className="mb-1 text-[0.8125rem] font-semibold">Channels</h3>
        <SettingRow label="Email" hint="mara@acme.io">
          <Badge tone="ok" dot>
            Connected
          </Badge>
        </SettingRow>
        <SettingRow label="Slack" hint="#eng-alerts">
          <Badge tone="ok" dot>
            Connected
          </Badge>
        </SettingRow>
        <SettingRow label="PagerDuty" hint="Escalate Sev-1 incidents">
          <Button variant="secondary" size="sm">
            <Link2 size={13} /> Connect
          </Button>
        </SettingRow>
      </Card>
    </div>
  );
}
