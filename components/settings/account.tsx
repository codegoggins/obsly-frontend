"use client";

import { useState } from "react";
import { UserRound, Trash2, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ImageUploadDialog } from "@/components/ui/image-upload-dialog";
import { SettingRow, Avatar } from "@/components/settings/setting-row";

export function Account() {
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">Account</h2>
        <p className="text-[0.78125rem] text-muted-foreground">Manage your personal profile.</p>
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-4 border-b border-border pb-4">
          <Avatar initials="MR" size={56} src={avatar} />
          <div className="flex-1">
            <div className="text-sm font-semibold">Mara Reyes</div>
            <div className="text-[0.78125rem] text-muted-foreground">mara@acme.io · Owner</div>
          </div>
          <Button variant="secondary" onClick={() => setAvatarOpen(true)}>
            <UserRound size={14} /> Change avatar
          </Button>
        </div>
        <div className="mt-1">
          <SettingRow label="Full name">
            <span className="font-mono text-[0.8125rem] text-muted-foreground">Mara Reyes</span>
          </SettingRow>
          <SettingRow label="Email" hint="Used for sign-in and alerts">
            <span className="font-mono text-[0.8125rem] text-muted-foreground">mara@acme.io</span>
          </SettingRow>
          <SettingRow label="Role">
            <Badge tone="brand">Owner</Badge>
          </SettingRow>
          <SettingRow label="Two-factor auth" hint="Authenticator app">
            <Badge tone="ok" dot>
              <ShieldCheck size={11} /> Enabled
            </Badge>
          </SettingRow>
        </div>
      </Card>

      <Card className="border-danger/25 p-5">
        <SettingRow label="Delete account" hint="Permanently remove your account and all data.">
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 size={14} /> Delete
          </Button>
        </SettingRow>
      </Card>

      <ImageUploadDialog
        open={avatarOpen}
        onOpenChange={setAvatarOpen}
        title="Change avatar"
        description="Upload a photo for your profile."
        shape="circle"
        onSave={setAvatar}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete account"
        description="This permanently removes your account, sessions, and personal data. As the Owner, transfer or delete the organization first if needed."
        confirmLabel="Delete account"
        destructive
        requireText="delete"
        onConfirm={() => {}}
      />
    </div>
  );
}
