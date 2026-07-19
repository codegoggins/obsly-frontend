"use client";

import { useState } from "react";
import { Building2, Upload, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ImageUploadDialog } from "@/components/ui/image-upload-dialog";
import { SettingRow, Avatar } from "@/components/settings/setting-row";
import { ORG } from "@/lib/mock/settings";

export function Organization() {
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [logoOpen, setLogoOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">Organization</h2>
        <p className="text-[0.78125rem] text-muted-foreground">General settings for {ORG.name}.</p>
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-4 border-b border-border pb-4">
          <Avatar initials={ORG.initial} size={56} src={logo} />
          <div className="flex-1">
            <div className="text-sm font-semibold">{ORG.name}</div>
            <div className="text-[0.78125rem] text-muted-foreground">obsly.dev/{ORG.slug}</div>
          </div>
          <Button variant="secondary" onClick={() => setLogoOpen(true)}>
            <Upload size={14} /> Change logo
          </Button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField label="Organization name" defaultValue={ORG.name} icon={Building2} />
          <InputField label="URL slug" defaultValue={ORG.slug} hint={`obsly.dev/${ORG.slug}`} />
        </div>
        <div className="mt-4 flex justify-end">
          <Button>Save changes</Button>
        </div>
      </Card>

      {/* danger zone */}
      <Card className="border-danger/25 p-5">
        <SettingRow label="Delete organization" hint="Permanently delete Acme Inc and all its projects.">
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 size={13} /> Delete
          </Button>
        </SettingRow>
      </Card>

      <ImageUploadDialog
        open={logoOpen}
        onOpenChange={setLogoOpen}
        title="Change organization logo"
        description="Upload a square image for Acme Inc."
        shape="circle"
        onSave={setLogo}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete organization"
        description="This permanently deletes Acme Inc, all its projects, and every event. This cannot be undone."
        confirmLabel="Delete organization"
        destructive
        requireText="delete"
        onConfirm={() => {}}
      />
    </div>
  );
}
