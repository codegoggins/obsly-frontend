"use client";

import { useState } from "react";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  requireText?: string; // when set, the confirm button unlocks only after this is typed
  onConfirm: () => void;
};

// shared confirmation modal for destructive/irreversible actions
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive,
  requireText,
  onConfirm,
}: ConfirmDialogProps) {
  const [text, setText] = useState("");

  // reset the type-to-confirm field whenever the dialog closes
  const handleOpenChange = (next: boolean) => {
    if (!next) setText("");
    onOpenChange(next);
  };

  const blocked = requireText ? text.trim() !== requireText : false;
  const confirm = () => {
    if (blocked) return;
    onConfirm();
    handleOpenChange(false);
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={handleOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-90 bg-black/55 backdrop-blur-[2px] transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <AlertDialog.Popup className="fixed left-1/2 top-1/2 z-100 w-[calc(100vw-2rem)] max-w-100 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-popover p-5 shadow-2xl outline-none transition-[transform,opacity] duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <AlertDialog.Title className="text-[0.9375rem] font-semibold">{title}</AlertDialog.Title>
          {description && (
            <AlertDialog.Description className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
              {description}
            </AlertDialog.Description>
          )}

          {requireText && (
            <div className="mt-4">
              <div className="mb-1.5 text-[0.75rem] text-muted-foreground">
                Type <span className="font-mono font-semibold text-foreground">{requireText}</span> to confirm
              </div>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && confirm()}
                autoFocus
                className="h-9 w-full rounded-md border border-border bg-card px-3 font-mono text-[0.8125rem] outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-ring/30"
              />
            </div>
          )}

          <div className="mt-5 flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => handleOpenChange(false)}>
              {cancelLabel}
            </Button>
            <Button variant={destructive ? "destructive" : "default"} size="sm" disabled={blocked} onClick={confirm}>
              {confirmLabel}
            </Button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
