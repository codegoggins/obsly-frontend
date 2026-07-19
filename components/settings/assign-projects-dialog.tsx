"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Check, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SETTINGS_PROJECTS } from "@/lib/mock/settings";

const ALL_IDS = SETTINGS_PROJECTS.map((p) => p.id);

type AssignProjectsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberName?: string;
  value: string[];
  onChange: (ids: string[]) => void;
  onSave: () => void;
};

function Row({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
        active ? "border-primary bg-primary/5" : "border-border hover:bg-accent",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="text-[0.8125rem] font-medium">{title}</div>
        <div className="truncate text-[0.71875rem] text-muted-foreground">{subtitle}</div>
      </div>
      <span className={cn("flex h-5 w-5 items-center justify-center rounded-md border", active ? "border-primary bg-primary text-white" : "border-border")}>
        {active && <Check size={12} />}
      </span>
    </button>
  );
}

// per-member project scope; empty selection means "no access", full means "all"
export function AssignProjectsDialog({ open, onOpenChange, memberName, value, onChange, onSave }: AssignProjectsDialogProps) {
  const allSelected = value.length === ALL_IDS.length;
  const toggle = (id: string) => onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  const toggleAll = () => onChange(allSelected ? [] : ALL_IDS);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-90 bg-black/55 backdrop-blur-[2px] transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-100 flex max-h-[calc(100vh-4rem)] w-[calc(100vw-2rem)] max-w-105 -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border border-border bg-popover shadow-2xl outline-none transition-[transform,opacity] duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <div className="flex items-start justify-between gap-4 p-5 pb-3">
            <div>
              <Dialog.Title className="text-[0.9375rem] font-semibold">Assign projects</Dialog.Title>
              <Dialog.Description className="mt-0.5 text-[0.8125rem] text-muted-foreground">
                {memberName ? `${memberName} will only see the projects you pick.` : "Scope which projects this member can see."}
              </Dialog.Description>
            </div>
            <Dialog.Close className="ring-focus -mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <X size={16} />
            </Dialog.Close>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto px-5">
            <button
              onClick={toggleAll}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                allSelected ? "border-primary bg-primary/5" : "border-border hover:bg-accent",
              )}
            >
              <Globe size={16} className="text-muted-foreground" />
              <div className="flex-1 text-[0.8125rem] font-medium">All projects</div>
              <span className={cn("flex h-5 w-5 items-center justify-center rounded-md border", allSelected ? "border-primary bg-primary text-white" : "border-border")}>
                {allSelected && <Check size={12} />}
              </span>
            </button>

            {SETTINGS_PROJECTS.map((p) => (
              <Row
                key={p.id}
                active={value.includes(p.id)}
                onClick={() => toggle(p.id)}
                title={p.name}
                subtitle={`${p.platform} · ${p.env}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-border p-4">
            <span className="text-[0.71875rem] text-muted-foreground">
              {value.length} of {ALL_IDS.length} selected
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={onSave}>
                Save access
              </Button>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
