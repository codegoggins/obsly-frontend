"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Rocket, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { CodeBlock } from "@/components/ui/code-block";
import { CopyButton } from "@/components/ui/copy-button";
import { StepNum } from "@/components/setup/step-num";
import { CopyField } from "@/components/setup/copy-field";
import { GithubAccount } from "@/components/setup/github-account";
import { GithubConnect } from "@/components/setup/github-connect";
import { LiveStatus } from "@/components/setup/live-status";
import { DSN, API_KEY, INSTALL, INIT_SNIPPETS } from "@/lib/mock/setup";

const PMS = Object.keys(INSTALL).map((k) => ({ value: k, label: k }));
const FRAMEWORKS = [
  { value: "nextjs", label: "Next.js" },
  { value: "node", label: "Node" },
  { value: "react", label: "React" },
];

export function SetupView() {
  const router = useRouter();
  const [pm, setPm] = useState("npm");
  const [fw, setFw] = useState("nextjs");
  const [received, setReceived] = useState(false);

  // simulate the first event arriving while the user is still reading
  useEffect(() => {
    if (received) return;
    const t = window.setTimeout(() => setReceived(true), 6500);
    return () => window.clearTimeout(t);
  }, [received]);

  return (
    <div className="mx-auto max-w-230 space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[0.78125rem] text-muted-foreground">
            <Rocket size={14} /> New project
          </div>
          <h1 className="text-[1.375rem] font-bold tracking-tight">Set up web-storefront</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Three steps to your first event. Should take about two minutes.</p>
        </div>
        <Button variant="ghost" className="text-muted-foreground" onClick={() => router.push("/settings")}>
          <Settings size={14} /> Project settings
        </Button>
      </div>

      <GithubAccount />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_20rem]">
        {/* steps */}
        <div className="space-y-4">
          {/* step 1 — credentials */}
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <StepNum n={1} done />
              <div className="text-sm font-semibold">Project credentials</div>
              <Badge tone="ok" className="ml-auto">
                Created
              </Badge>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 pl-9 sm:grid-cols-2">
              <CopyField label="DSN" value={DSN} />
              <CopyField label="API key" value={API_KEY} secret />
            </div>
          </Card>

          {/* step 2 — install */}
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <StepNum n={2} />
              <div className="text-sm font-semibold">Install the SDK</div>
            </div>
            <div className="mt-4 pl-9">
              <div className="mb-2">
                <Segmented value={pm} onChange={setPm} options={PMS} />
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2.5">
                <span className="select-none text-muted-foreground/60">$</span>
                <span className="flex-1 font-mono text-[0.78125rem] text-foreground">{INSTALL[pm]}</span>
                <CopyButton text={INSTALL[pm]} />
              </div>
            </div>
          </Card>

          {/* step 3 — initialize */}
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <StepNum n={3} />
              <div className="text-sm font-semibold">Initialize Obsly</div>
            </div>
            <div className="mt-4 pl-9">
              <div className="mb-2 flex items-center justify-between gap-2">
                <Segmented value={fw} onChange={setFw} options={FRAMEWORKS} />
                <CopyButton text={INIT_SNIPPETS[fw]} label="Copy" />
              </div>
              <CodeBlock code={INIT_SNIPPETS[fw]} />
            </div>
          </Card>

          {/* step 4 — connect repos */}
          <GithubConnect />
        </div>

        {/* live status rail */}
        <LiveStatus received={received} onSimulate={() => setReceived(true)} />
      </div>
    </div>
  );
}
