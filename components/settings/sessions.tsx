"use client";

import { useState } from "react";
import { Monitor, Smartphone, ShieldCheck, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SettingRow } from "@/components/settings/setting-row";
import { SESSIONS, type Session } from "@/lib/mock/settings";

const deviceIcon = (device: string) => (device.toLowerCase().includes("iphone") ? Smartphone : Monitor);

type Pending = {
  title: string;
  description?: React.ReactNode;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
};

export function Sessions() {
  const [sessions, setSessions] = useState<Session[]>(SESSIONS);
  const [twoFA, setTwoFA] = useState(true);
  const [confirm, setConfirm] = useState<Pending | null>(null);

  const others = sessions.filter((s) => !s.current).length;
  const emphasize = (s: string) => <span className="font-medium text-foreground">{s}</span>;

  const askRevoke = (s: Session) =>
    setConfirm({
      title: "Revoke session",
      description: <>Sign out {emphasize(s.device)} in {s.location}? That device will need to log in again.</>,
      confirmLabel: "Revoke session",
      destructive: true,
      onConfirm: () => setSessions((xs) => xs.filter((x) => x.id !== s.id)),
    });

  const askRevokeOthers = () =>
    setConfirm({
      title: "Sign out everywhere else",
      description: <>End all {others} other active sessions? Only this device stays signed in.</>,
      confirmLabel: "Sign out others",
      destructive: true,
      onConfirm: () => setSessions((xs) => xs.filter((s) => s.current)),
    });

  const askToggle2FA = () =>
    setConfirm(
      twoFA
        ? {
            title: "Disable two-factor authentication",
            description: "Your account will be protected by password only. We strongly recommend keeping 2FA on.",
            confirmLabel: "Disable 2FA",
            destructive: true,
            onConfirm: () => setTwoFA(false),
          }
        : {
            title: "Enable two-factor authentication",
            description: "You'll be asked to scan a QR code with your authenticator app and enter a 6-digit code.",
            confirmLabel: "Continue",
            onConfirm: () => setTwoFA(true),
          },
    );

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
                <Button variant="secondary" size="sm" onClick={() => askRevoke(s)}>
                  Revoke
                </Button>
              )}
            </div>
          );
        })}
      </Card>

      <Card className="p-5">
        <SettingRow label="Sign out everywhere else" hint={`End ${others} other active ${others === 1 ? "session" : "sessions"}.`}>
          <Button variant="destructive" size="sm" disabled={others === 0} onClick={askRevokeOthers}>
            <LogOut size={13} /> Sign out others
          </Button>
        </SettingRow>
        <SettingRow
          label="Two-factor authentication"
          hint={twoFA ? "Authenticator app enabled" : "Protect your account with an authenticator app"}
        >
          <div className="flex items-center gap-2">
            {twoFA ? (
              <Badge tone="ok" dot>
                <ShieldCheck size={11} /> Enabled
              </Badge>
            ) : (
              <Badge tone="muted">Disabled</Badge>
            )}
            <Button variant={twoFA ? "secondary" : "default"} size="sm" onClick={askToggle2FA}>
              {twoFA ? "Disable" : "Enable"}
            </Button>
          </div>
        </SettingRow>
      </Card>

      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(o) => !o && setConfirm(null)}
        title={confirm?.title ?? ""}
        description={confirm?.description}
        confirmLabel={confirm?.confirmLabel ?? "Confirm"}
        destructive={confirm?.destructive}
        onConfirm={() => confirm?.onConfirm()}
      />
    </div>
  );
}
