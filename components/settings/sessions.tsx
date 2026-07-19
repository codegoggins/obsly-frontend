"use client";

import { useState } from "react";
import { Monitor, Smartphone, ShieldCheck, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SettingRow } from "@/components/settings/setting-row";
import { SESSIONS, type Session } from "@/lib/mock/settings";

const deviceIcon = (device: string) => (device.toLowerCase().includes("iphone") ? Smartphone : Monitor);

export function Sessions() {
  const [sessions, setSessions] = useState<Session[]>(SESSIONS);
  const [twoFA, setTwoFA] = useState(true);

  const revoke = (id: string) => setSessions((xs) => xs.filter((s) => s.id !== id));
  const revokeOthers = () => setSessions((xs) => xs.filter((s) => s.current));
  const others = sessions.filter((s) => !s.current).length;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">Sessions</h2>
        <p className="text-[0.78125rem] text-muted-foreground">Devices currently signed in to your account.</p>
      </div>

      <Card>
        {sessions.map((s) => {
          const Icon = deviceIcon(s.device);
          return (
            <div key={s.id} className="flex items-center gap-3 border-b border-border px-4 py-3.5 last:border-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[0.8125rem] font-medium">{s.device}</span>
                  {s.current && (
                    <Badge tone="ok" dot>
                      this device
                    </Badge>
                  )}
                </div>
                <div className="truncate text-[0.71875rem] text-muted-foreground">
                  {s.browser} · {s.location} · <span className="font-mono">{s.ip}</span>
                </div>
              </div>
              <span className="hidden text-[0.6875rem] text-muted-foreground sm:block">{s.lastActive}</span>
              {!s.current && (
                <Button variant="secondary" size="sm" onClick={() => revoke(s.id)}>
                  Revoke
                </Button>
              )}
            </div>
          );
        })}
      </Card>

      <Card className="p-5">
        <SettingRow label="Sign out everywhere else" hint={`End ${others} other active ${others === 1 ? "session" : "sessions"}.`}>
          <Button variant="destructive" size="sm" disabled={others === 0} onClick={revokeOthers}>
            <LogOut size={13} /> Sign out others
          </Button>
        </SettingRow>
        <SettingRow label="Two-factor authentication" hint={twoFA ? "Authenticator app enabled" : "Protect your account with an authenticator app"}>
          <div className="flex items-center gap-2">
            {twoFA ? (
              <Badge tone="ok" dot>
                <ShieldCheck size={11} /> Enabled
              </Badge>
            ) : (
              <Badge tone="muted">Disabled</Badge>
            )}
            <Button variant={twoFA ? "secondary" : "default"} size="sm" onClick={() => setTwoFA((v) => !v)}>
              {twoFA ? "Disable" : "Enable"}
            </Button>
          </div>
        </SettingRow>
      </Card>
    </div>
  );
}
