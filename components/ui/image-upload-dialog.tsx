"use client";

import { useRef, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Upload, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml";
const MAX_MB = 4;

type ImageUploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  shape?: "circle" | "square";
  onSave: (dataUrl: string) => void;
};

// image-only upload modal with a live preview; rejects non-images
export function ImageUploadDialog({ open, onOpenChange, title, description, shape = "circle", onSave }: ImageUploadDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // clear the picked image whenever the dialog closes
  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setPreview(null);
      setError(null);
    }
    onOpenChange(next);
  };

  const handleFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed (PNG, JPG, WEBP, GIF or SVG).");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_MB} MB.`);
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (!preview) return;
    onSave(preview);
    handleOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-90 bg-black/55 backdrop-blur-[2px] transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-100 w-[calc(100vw-2rem)] max-w-105 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-popover p-5 shadow-2xl outline-none transition-[transform,opacity] duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-[0.9375rem] font-semibold">{title}</Dialog.Title>
              {description && <Dialog.Description className="mt-0.5 text-[0.8125rem] text-muted-foreground">{description}</Dialog.Description>}
            </div>
            <Dialog.Close className="ring-focus -mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <X size={16} />
            </Dialog.Close>
          </div>

          <div className="mt-4 flex flex-col items-center gap-4">
            <div
              className={cn(
                "flex h-24 w-24 items-center justify-center overflow-hidden border border-border bg-muted bg-cover bg-center",
                shape === "circle" ? "rounded-full" : "rounded-xl",
              )}
              style={preview ? { backgroundImage: `url(${preview})` } : undefined}
            >
              {!preview && <ImageIcon size={28} className="text-muted-foreground/50" />}
            </div>

            <button
              onClick={() => inputRef.current?.click()}
              className="ring-focus flex w-full flex-col items-center gap-1.5 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-5 text-center transition-colors hover:bg-accent"
            >
              <Upload size={18} className="text-muted-foreground" />
              <span className="text-[0.8125rem] font-medium">Click to upload an image</span>
              <span className="text-[0.71875rem] text-muted-foreground">PNG, JPG, WEBP, GIF or SVG · up to {MAX_MB} MB</span>
            </button>
            <input ref={inputRef} type="file" accept={ACCEPT} className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />

            {error && (
              <div className="w-full rounded-md border border-danger/25 bg-danger/8 px-3 py-2 text-[0.75rem] text-danger">{error}</div>
            )}
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button size="sm" disabled={!preview} onClick={save}>
              Save image
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
