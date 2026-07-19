"use client";

import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Mail, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { cn } from "@/lib/utils";
import { ORG } from "@/lib/mock/settings";

type RoleOption = { name: string; description: string };

type InviteMemberDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: RoleOption[];
  onInvite: (email: string, role: string) => void;
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export function InviteMemberDialog({ open, onOpenChange, roles, onInvite }: InviteMemberDialogProps) {
  const defaultRole = roles.find((r) => r.name === "Member")?.name ?? roles[0]?.name ?? "";
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(defaultRole);

  // reset the form whenever the modal closes
  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setEmail("");
      setRole(defaultRole);
    }
    onOpenChange(next);
  };

  const send = () => {
    if (!isEmail(email)) return;
    onInvite(email.trim(), role);
    handleOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-90 bg-black/55 backdrop-blur-[2px] transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-100 w-[calc(100vw-2rem)] max-w-105 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-popover p-5 shadow-2xl outline-none transition-[transform,opacity] duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-[0.9375rem] font-semibold">Invite people</Dialog.Title>
              <Dialog.Description className="mt-0.5 text-[0.8125rem] text-muted-foreground">
                They&apos;ll get an email link to join {ORG.name}.
              </Dialog.Description>
            </div>
            <Dialog.Close className="ring-focus -mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <X size={16} />
            </Dialog.Close>
          </div>

          <div className="mt-4">
            <InputField
              label="Email address"
              placeholder="teammate@company.com"
              icon={Mail}
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
          </div>

          <div className="mt-4">
            <div className="mb-1.5 text-[0.78125rem] font-medium text-foreground/85">Role</div>
            <div className="space-y-2">
              {roles.map((r) => {
                const active = role === r.name;
                return (
                  <button
                    key={r.name}
                    onClick={() => setRole(r.name)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                      active ? "border-primary bg-primary/5" : "border-border hover:bg-accent",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[0.8125rem] font-medium">{r.name}</div>
                      <div className="text-[0.71875rem] text-muted-foreground">{r.description}</div>
                    </div>
                    <span className={cn("flex h-5 w-5 items-center justify-center rounded-full border", active ? "border-primary bg-primary text-white" : "border-border")}>
                      {active && <Check size={12} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button size="sm" disabled={!isEmail(email)} onClick={send}>
              <Mail size={14} /> Send invite
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
