"use client";

import { useState } from "react";
import { Building2, Users, ShieldCheck, Layers, Bell, MonitorSmartphone, Palette, UserRound, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Organization } from "@/components/settings/organization";
import { Members } from "@/components/settings/members";
import { Roles } from "@/components/settings/roles";
import { Projects } from "@/components/settings/projects";
import { Notifications } from "@/components/settings/notifications";
import { Sessions } from "@/components/settings/sessions";
import { Appearance } from "@/components/settings/appearance";
import { Account } from "@/components/settings/account";

const NAV: { key: string; label: string; icon: LucideIcon; panel: React.ReactNode }[] = [
  { key: "organization", label: "Organization", icon: Building2, panel: <Organization /> },
  { key: "members", label: "Members", icon: Users, panel: <Members /> },
  { key: "roles", label: "Roles", icon: ShieldCheck, panel: <Roles /> },
  { key: "projects", label: "Projects", icon: Layers, panel: <Projects /> },
  { key: "notifications", label: "Notifications", icon: Bell, panel: <Notifications /> },
  { key: "sessions", label: "Sessions", icon: MonitorSmartphone, panel: <Sessions /> },
  { key: "appearance", label: "Appearance", icon: Palette, panel: <Appearance /> },
  { key: "account", label: "Account", icon: UserRound, panel: <Account /> },
];

export function SettingsView() {
  const [tab, setTab] = useState("organization");
  const active = NAV.find((n) => n.key === tab) ?? NAV[0];

  return (
    <div className="mx-auto max-w-270">
      <h1 className="mb-5 text-[1.375rem] font-bold tracking-tight">Settings</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[12.5rem_1fr]">
        <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setTab(n.key)}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-[0.8125rem] font-medium transition-colors md:w-full",
                tab === n.key ? "bg-primary/12 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <n.icon size={15} /> {n.label}
            </button>
          ))}
        </nav>
        <div className="min-w-0">{active.panel}</div>
      </div>
    </div>
  );
}
