"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function Sheet(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}

function SheetTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

type SheetContentProps = React.ComponentProps<typeof DialogPrimitive.Popup> & {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
};

// right-hand slide-over built on Base UI Dialog (backdrop + focus trap included)
function SheetContent({ title, subtitle, icon: Icon, className, children, ...props }: SheetContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-80 bg-black/45 backdrop-blur-[1px] transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0" />
      <DialogPrimitive.Popup
        data-slot="sheet-content"
        className={cn(
          "fixed inset-y-0 right-0 z-90 flex h-full w-108 max-w-[calc(100vw-2rem)] flex-col border-l border-border bg-popover shadow-2xl outline-none",
          "transition-transform duration-300 ease-out data-ending-style:translate-x-full data-starting-style:translate-x-full",
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          {Icon && (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Icon size={16} />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <DialogPrimitive.Title className="text-sm font-semibold leading-tight">{title}</DialogPrimitive.Title>
            {subtitle && <div className="truncate text-[0.75rem] text-muted-foreground">{subtitle}</div>}
          </div>
          <DialogPrimitive.Close className="ring-focus flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <X size={16} />
          </DialogPrimitive.Close>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

export { Sheet, SheetTrigger, SheetContent };
