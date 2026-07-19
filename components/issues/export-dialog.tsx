"use client";

import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { FileText, Braces, FileDown, Download, X, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FORMATS: { value: string; label: string; ext: string; hint: string; icon: LucideIcon }[] = [
  { value: "csv", label: "CSV", ext: ".csv", hint: "Spreadsheet-friendly rows", icon: FileText },
  { value: "json", label: "JSON", ext: ".json", hint: "Full structured data", icon: Braces },
  { value: "pdf", label: "PDF", ext: ".pdf", hint: "Shareable report", icon: FileDown },
];

type ExportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scopeLabel: string; // e.g. "5 issues" or "OBS-4821"
};

export function ExportDialog({ open, onOpenChange, scopeLabel }: ExportDialogProps) {
  const [format, setFormat] = useState("csv");

  const handleOpenChange = (next: boolean) => {
    if (!next) setFormat("csv");
    onOpenChange(next);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-90 bg-black/55 backdrop-blur-[2px] transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-100 w-[calc(100vw-2rem)] max-w-105 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-popover p-5 shadow-2xl outline-none transition-[transform,opacity] duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-[0.9375rem] font-semibold">Export</Dialog.Title>
              <Dialog.Description className="mt-0.5 text-[0.8125rem] text-muted-foreground">
                Download <span className="font-medium text-foreground">{scopeLabel}</span> with events, stack traces, and breadcrumbs.
              </Dialog.Description>
            </div>
            <Dialog.Close className="ring-focus -mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <X size={16} />
            </Dialog.Close>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {FORMATS.map((f) => {
              const active = format === f.value;
              const Icon = f.icon;
              return (
                <button
                  key={f.value}
                  onClick={() => setFormat(f.value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 text-center transition-colors",
                    active ? "border-primary bg-primary/5" : "border-border hover:bg-accent",
                  )}
                >
                  <Icon size={20} className={active ? "text-primary" : "text-muted-foreground"} />
                  <span className="text-[0.8125rem] font-medium">{f.label}</span>
                  <span className="text-[0.65625rem] text-muted-foreground">{f.hint}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => handleOpenChange(false)}>
              <Download size={14} /> Export {FORMATS.find((f) => f.value === format)?.ext}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
