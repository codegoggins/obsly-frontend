"use client";

import { useState } from "react";
import { Mail, UserPlus, X, MoreHorizontal, UserCog, FolderKanban, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/settings/setting-row";
import { ChangeRoleDialog } from "@/components/settings/change-role-dialog";
import { AssignProjectsDialog } from "@/components/settings/assign-projects-dialog";
import { InviteMemberDialog } from "@/components/settings/invite-member-dialog";
import { MEMBERS, INVITES, ORG, SETTINGS_PROJECTS, type Invite, type Member, type MemberRole } from "@/lib/mock/settings";
import { DEFAULT_ROLES } from "@/lib/mock/rbac";

// roles that can be assigned to a member (Owner is not assignable here)
const ASSIGNABLE_ROLES = DEFAULT_ROLES.filter((r) => r.name !== "Owner");
const ROLE_CHOICES = ASSIGNABLE_ROLES.map((r) => ({ name: r.name, description: r.description }));

const TOTAL_PROJECTS = SETTINGS_PROJECTS.length;
const scopeLabel = (ids: string[]) =>
  ids.length >= TOTAL_PROJECTS ? "All projects" : ids.length === 0 ? "No projects" : `${ids.length} projects`;

type Pending = {
  title: string;
  description?: React.ReactNode;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
};

export function Members() {
  const [members, setMembers] = useState<Member[]>(MEMBERS);
  const [invites, setInvites] = useState<Invite[]>(INVITES);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [confirm, setConfirm] = useState<Pending | null>(null);
  const [roleMember, setRoleMember] = useState<Member | null>(null);
  const [selectedRole, setSelectedRole] = useState<MemberRole>("Member");
  const [projectMember, setProjectMember] = useState<Member | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const emphasize = (s: string) => <span className="font-medium text-foreground">{s}</span>;

  // set both the target and the initial selection at open time (no effect needed)
  const openRoleDialog = (m: Member) => {
    setRoleMember(m);
    setSelectedRole(m.role);
  };

  const openProjectsDialog = (m: Member) => {
    setProjectMember(m);
    setSelectedProjects(m.projects);
  };

  const addInvite = (email: string, role: string) =>
    setInvites((xs) => [{ id: email, email, role, sentAgo: "just now" }, ...xs]);

  const askRevoke = (inv: Invite) =>
    setConfirm({
      title: "Revoke invitation",
      description: <>Revoke the invite sent to {emphasize(inv.email)}? The link will stop working.</>,
      confirmLabel: "Revoke invite",
      destructive: true,
      onConfirm: () => setInvites((xs) => xs.filter((x) => x.id !== inv.id)),
    });

  const askRemove = (m: Member) =>
    setConfirm({
      title: "Remove member",
      description: <>Remove {emphasize(m.name)} from {ORG.name}? They will immediately lose access.</>,
      confirmLabel: "Remove member",
      destructive: true,
      onConfirm: () => setMembers((xs) => xs.filter((x) => x.id !== m.id)),
    });

  const changeRole = (id: string, r: MemberRole) => setMembers((xs) => xs.map((m) => (m.id === id ? { ...m, role: r } : m)));
  const setProjects = (id: string, ids: string[]) => setMembers((xs) => xs.map((m) => (m.id === id ? { ...m, projects: ids } : m)));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Members</h2>
          <p className="text-[0.78125rem] text-muted-foreground">
            {members.length} members · {ORG.seats.used} of {ORG.seats.total} seats used
          </p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <UserPlus size={14} /> Invite people
        </Button>
      </div>

      {/* members list */}
      <Card>
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-0">
            <Avatar initials={m.initials} tone={m.tone} size={34} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[0.8125rem] font-medium">{m.name}</div>
              <div className="truncate text-[0.71875rem] text-muted-foreground">{m.email}</div>
            </div>
            <span className="hidden text-[0.6875rem] text-muted-foreground md:block">{scopeLabel(m.projects)}</span>
            <Badge tone={m.role === "Owner" ? "brand" : "outline"}>{m.role}</Badge>

            {m.role === "Owner" ? (
              <span className="flex h-8 w-8 items-center justify-center text-muted-foreground/30">
                <MoreHorizontal size={16} />
              </span>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label={`Manage ${m.name}`}
                  className="ring-focus flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <MoreHorizontal size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openRoleDialog(m)}>
                    <UserCog size={14} /> Change role
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openProjectsDialog(m)}>
                    <FolderKanban size={14} /> Assign projects
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-danger data-highlighted:bg-danger/10 data-highlighted:text-danger" onClick={() => askRemove(m)}>
                    <Trash2 size={14} /> Remove from organization
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ))}
      </Card>

      {/* pending invites */}
      {invites.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2 text-[0.8125rem] font-semibold">
            Pending invites <Badge tone="warn">{invites.length}</Badge>
          </div>
          <Card>
            {invites.map((inv) => (
              <div key={inv.id} className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-0">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground">
                  <Mail size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[0.8125rem] font-medium">{inv.email}</div>
                  <div className="text-[0.71875rem] text-muted-foreground">{inv.sentAgo}</div>
                </div>
                <Badge tone="outline">{inv.role}</Badge>
                <button
                  onClick={() => askRevoke(inv)}
                  aria-label="Revoke invite"
                  className="ring-focus flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-danger/12 hover:text-danger"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </Card>
        </div>
      )}

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} roles={ROLE_CHOICES} onInvite={addInvite} />

      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(o) => !o && setConfirm(null)}
        title={confirm?.title ?? ""}
        description={confirm?.description}
        confirmLabel={confirm?.confirmLabel ?? "Confirm"}
        destructive={confirm?.destructive}
        onConfirm={() => confirm?.onConfirm()}
      />

      <ChangeRoleDialog
        open={!!roleMember}
        onOpenChange={(o) => !o && setRoleMember(null)}
        memberName={roleMember?.name}
        roles={ROLE_CHOICES}
        value={selectedRole}
        onChange={setSelectedRole}
        onSave={() => {
          if (roleMember) changeRole(roleMember.id, selectedRole);
          setRoleMember(null);
        }}
      />

      <AssignProjectsDialog
        open={!!projectMember}
        onOpenChange={(o) => !o && setProjectMember(null)}
        memberName={projectMember?.name}
        value={selectedProjects}
        onChange={setSelectedProjects}
        onSave={() => {
          if (projectMember) setProjects(projectMember.id, selectedProjects);
          setProjectMember(null);
        }}
      />
    </div>
  );
}
