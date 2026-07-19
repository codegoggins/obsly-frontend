"use client";

import { useState } from "react";
import { Plus, Pencil, Eye, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { RoleEditor } from "@/components/settings/role-editor";
import { DEFAULT_ROLES, PERMISSION_COUNT, type Role } from "@/lib/mock/rbac";

const blankRole = (): Role => ({
  id: "",
  name: "",
  description: "",
  color: "warn",
  members: 0,
  permissions: ["nav:overview"],
});

export function Roles() {
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);
  const [draft, setDraft] = useState<Role | null>(null);
  const [toDelete, setToDelete] = useState<Role | null>(null);

  const save = () => {
    if (!draft) return;
    if (draft.id === "") {
      setRoles((rs) => [...rs, { ...draft, id: crypto.randomUUID() }]);
    } else {
      setRoles((rs) => rs.map((r) => (r.id === draft.id ? draft : r)));
    }
    setDraft(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Roles &amp; permissions</h2>
          <p className="text-[0.78125rem] text-muted-foreground">Control what each role can see in the sidebar and do across the app.</p>
        </div>
        <Button onClick={() => setDraft(blankRole())}>
          <Plus size={14} /> New role
        </Button>
      </div>

      <div className="space-y-2.5">
        {roles.map((role) => (
          <Card key={role.id} className="flex items-start gap-3 p-4">
            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: `hsl(var(--${role.color}))` }} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[0.84375rem] font-semibold">{role.name}</span>
                {role.system && <Badge tone="muted">Built-in</Badge>}
              </div>
              <p className="mt-0.5 text-[0.75rem] text-muted-foreground">{role.description}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6875rem] text-muted-foreground">
                <span>{role.members} {role.members === 1 ? "member" : "members"}</span>
                <span className="text-muted-foreground/40">·</span>
                <span>
                  <span className="font-medium text-foreground/80">{role.permissions.length}</span>/{PERMISSION_COUNT} permissions
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <Button variant="secondary" size="sm" onClick={() => setDraft({ ...role })}>
                {role.locked ? <Eye size={13} /> : <Pencil size={13} />}
                {role.locked ? "View" : "Edit"}
              </Button>
              {!role.system && (
                <button
                  onClick={() => setToDelete(role)}
                  aria-label={`Delete ${role.name}`}
                  className="ring-focus flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-danger/12 hover:text-danger"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <RoleEditor draft={draft} onOpenChange={(o) => !o && setDraft(null)} onChange={setDraft} onSave={save} />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete role"
        description={
          <>
            Delete the <span className="font-medium text-foreground">{toDelete?.name}</span> role?{" "}
            {toDelete && toDelete.members > 0 ? `Its ${toDelete.members} member(s) will need a new role.` : "No members currently use it."}
          </>
        }
        confirmLabel="Delete role"
        destructive
        onConfirm={() => toDelete && setRoles((rs) => rs.filter((r) => r.id !== toDelete.id))}
      />
    </div>
  );
}
