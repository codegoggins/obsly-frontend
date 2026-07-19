"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Check, X, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/settings/setting-row";
import { cn } from "@/lib/utils";
import { MEMBERS } from "@/lib/mock/settings";

type AssignDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subtitle?: string;
  value: string | null; // member id or null (unassigned)
  onChange: (memberId: string | null) => void;
  onSave: () => void;
};

export function AssignDialog({ open, onOpenChange, subtitle, value, onChange, onSave }: AssignDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-90 bg-black/55 backdrop-blur-[2px] transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-100 flex max-h-[calc(100vh-4rem)] w-[calc(100vw-2rem)] max-w-105 -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border border-border bg-popover shadow-2xl outline-none transition-[transform,opacity] duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <div className="flex items-start justify-between gap-4 p-5 pb-3">
            <div>
              <Dialog.Title className="text-[0.9375rem] font-semibold">Assign</Dialog.Title>
              <Dialog.Description className="mt-0.5 text-[0.8125rem] text-muted-foreground">
                {subtitle ?? "Pick who owns this."}
              </Dialog.Description>
            </div>
            <Dialog.Close className="ring-focus -mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <X size={16} />
            </Dialog.Close>
          </div>

          <div className="flex-1 space-y-1.5 overflow-y-auto px-5">
            <button
              onClick={() => onChange(null)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors",
                value === null ? "border-primary bg-primary/5" : "border-border hover:bg-accent",
              )}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground">
                <UserX size={15} />
              </span>
              <span className="flex-1 text-[0.8125rem] font-medium">Unassigned</span>
              {value === null && <Check size={16} className="text-primary" />}
            </button>

            {MEMBERS.map((m) => {
              const active = value === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onChange(m.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors",
                    active ? "border-primary bg-primary/5" : "border-border hover:bg-accent",
                  )}
                >
                  <Avatar initials={m.initials} tone={m.tone} size={32} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[0.8125rem] font-medium">{m.name}</div>
                    <div className="truncate text-[0.71875rem] text-muted-foreground">{m.role}</div>
                  </div>
                  {active && <Check size={16} className="text-primary" />}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end gap-2 border-t border-border p-4">
            <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={onSave}>
              Assign
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
