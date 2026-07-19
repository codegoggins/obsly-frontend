"use client";

import { Shield, LayoutGrid, Bug, LineChart, Users, Layers, Building2, type LucideIcon } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { Switch } from "@/components/ui/switch";
import { PERMISSION_GROUPS, type Role, type PermissionGroup } from "@/lib/mock/rbac";

const GROUP_ICONS: Record<PermissionGroup["icon"], LucideIcon> = {
  nav: LayoutGrid,
  issues: Bug,
  metrics: LineChart,
  members: Users,
  projects: Layers,
  org: Building2,
};

type RoleEditorProps = {
  draft: Role | null;
  onOpenChange: (open: boolean) => void;
  onChange: (role: Role) => void;
  onSave: () => void;
};

export function RoleEditor({ draft, onOpenChange, onChange, onSave }: RoleEditorProps) {
  const locked = draft?.locked;
  const isNew = draft?.id === "";
  const canSave = !!draft && draft.name.trim().length > 0 && !locked;

  const has = (key: string) => draft?.permissions.includes(key) ?? false;

  const setPerm = (key: string, on: boolean) => {
    if (!draft) return;
    onChange({
      ...draft,
      permissions: on ? [...new Set([...draft.permissions, key])] : draft.permissions.filter((p) => p !== key),
    });
  };

  const toggleGroup = (group: PermissionGroup) => {
    if (!draft) return;
    const keys = group.permissions.map((p) => p.key);
    const all = keys.every(has);
    onChange({
      ...draft,
      permissions: all
        ? draft.permissions.filter((p) => !keys.includes(p))
        : [...new Set([...draft.permissions, ...keys])],
    });
  };

  return (
    <Sheet open={!!draft} onOpenChange={onOpenChange}>
      {draft && (
        <SheetContent
          icon={Shield}
          title={isNew ? "New role" : locked ? draft.name : `Edit ${draft.name}`}
          subtitle={locked ? "Managed by Obsly · read-only" : "Define what this role can see and do"}
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
                {locked ? "Close" : "Cancel"}
              </Button>
              {!locked && (
                <Button size="sm" disabled={!canSave} onClick={onSave}>
                  {isNew ? "Create role" : "Save role"}
                </Button>
              )}
            </>
          }
        >
          <div className="space-y-5">
            <InputField
              label="Role name"
              placeholder="e.g. Support engineer"
              value={draft.name}
              disabled={locked}
              onChange={(e) => onChange({ ...draft, name: e.target.value })}
            />
            <div>
              <div className="mb-1.5 text-[0.78125rem] font-medium text-foreground/85">Description</div>
              <textarea
                rows={2}
                placeholder="What is this role for?"
                value={draft.description}
                disabled={locked}
                onChange={(e) => onChange({ ...draft, description: e.target.value })}
                className="w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/40 focus:ring-2 focus:ring-ring/30 disabled:opacity-70"
              />
            </div>

            <div className="space-y-4">
              {PERMISSION_GROUPS.map((group) => {
                const Icon = GROUP_ICONS[group.icon];
                const selected = group.permissions.filter((p) => has(p.key)).length;
                return (
                  <div key={group.key} className="rounded-lg border border-border">
                    <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
                      <Icon size={15} className="text-muted-foreground" />
                      <span className="text-[0.8125rem] font-semibold">{group.label}</span>
                      <span className="ml-auto text-[0.6875rem] text-muted-foreground">
                        {selected}/{group.permissions.length}
                      </span>
                      <Switch
                        checked={selected === group.permissions.length}
                        disabled={locked}
                        onCheckedChange={() => toggleGroup(group)}
                      />
                    </div>
                    <div className="divide-y divide-border px-3">
                      {group.permissions.map((p) => (
                        <div key={p.key} className="flex items-center justify-between gap-3 py-2.5">
                          <div className="min-w-0">
                            <div className="text-[0.8125rem]">{p.label}</div>
                            {p.hint && <div className="text-[0.6875rem] text-muted-foreground">{p.hint}</div>}
                          </div>
                          <Switch checked={has(p.key)} disabled={locked} onCheckedChange={(v) => setPerm(p.key, v)} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </SheetContent>
      )}
    </Sheet>
  );
}
