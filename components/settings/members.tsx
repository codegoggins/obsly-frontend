"use client";

import { useState } from "react";
import { Mail, UserPlus, X, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { MenuPicker } from "@/components/ui/menu-picker";
import { Avatar } from "@/components/settings/setting-row";
import { MEMBERS, INVITES, ROLES, ORG, type Invite } from "@/lib/mock/settings";

const ROLE_OPTIONS = ROLES.filter((r) => r !== "Owner").map((r) => ({ value: r, label: r }));

export function Members() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("Member");
  const [invites, setInvites] = useState<Invite[]>(INVITES);

  const sendInvite = () => {
    if (!email.trim()) return;
    setInvites((xs) => [{ id: email, email: email.trim(), role: role as Invite["role"], sentAgo: "just now" }, ...xs]);
    setEmail("");
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">Members</h2>
        <p className="text-[0.78125rem] text-muted-foreground">
          {MEMBERS.length} members · {ORG.seats.used} of {ORG.seats.total} seats used
        </p>
      </div>

      {/* invite */}
      <Card className="p-5">
        <div className="mb-3 flex items-center gap-2 text-[0.8125rem] font-semibold">
          <UserPlus size={15} className="text-primary" /> Invite people
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1">
            <InputField
              placeholder="teammate@company.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendInvite()}
            />
          </div>
          <MenuPicker value={role} onChange={setRole} options={ROLE_OPTIONS} />
          <Button onClick={sendInvite}>
            <Mail size={14} /> Send invite
          </Button>
        </div>
        <p className="mt-2 text-[0.71875rem] text-muted-foreground">Invitees receive an email link to join {ORG.name}.</p>
      </Card>

      {/* members list */}
      <Card>
        {MEMBERS.map((m) => (
          <div key={m.id} className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-0">
            <Avatar initials={m.initials} tone={m.tone} size={34} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[0.8125rem] font-medium">{m.name}</div>
              <div className="truncate text-[0.71875rem] text-muted-foreground">{m.email}</div>
            </div>
            <span className="hidden text-[0.6875rem] text-muted-foreground sm:block">{m.lastActive}</span>
            {m.role === "Owner" ? (
              <Badge tone="brand">Owner</Badge>
            ) : (
              <Badge tone="outline">{m.role}</Badge>
            )}
            <button
              disabled={m.role === "Owner"}
              className="ring-focus flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-30"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        ))}
      </Card>

      {/* pending invites */}
      {invites.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2 text-[0.8125rem] font-semibold">
            Pending invites <Badge tone="warn">{invites.length}</Badge>
          </div>
          <Card>
            {invites.map((inv) => (
              <div key={inv.id} className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-0">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground">
                  <Mail size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[0.8125rem] font-medium">{inv.email}</div>
                  <div className="text-[0.71875rem] text-muted-foreground">{inv.sentAgo}</div>
                </div>
                <Badge tone="outline">{inv.role}</Badge>
                <button
                  onClick={() => setInvites((xs) => xs.filter((x) => x.id !== inv.id))}
                  aria-label="Revoke invite"
                  className="ring-focus flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-danger/12 hover:text-danger"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}
