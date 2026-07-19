// RBAC model — permission catalog + roles. Kept React-free (icon keys, not components).

export type Permission = { key: string; label: string; hint?: string };

export type PermissionGroup = {
  key: string;
  label: string;
  icon: "nav" | "issues" | "metrics" | "members" | "projects" | "org";
  permissions: Permission[];
};

// grouped catalog — "Navigation" controls sidebar visibility, the rest are actions
export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    key: "nav",
    label: "What they can see",
    icon: "nav",
    permissions: [
      { key: "nav:overview", label: "Overview", hint: "See the dashboard" },
      { key: "nav:projects", label: "Projects" },
      { key: "nav:issues", label: "Issues" },
      { key: "nav:metrics", label: "Metrics" },
      { key: "nav:setup", label: "Setup" },
      { key: "nav:settings", label: "Settings" },
    ],
  },
  {
    key: "issues",
    label: "Issues",
    icon: "issues",
    permissions: [
      { key: "issues:resolve", label: "Resolve & ignore issues" },
      { key: "issues:assign", label: "Assign issues to people" },
      { key: "issues:delete", label: "Delete issues" },
    ],
  },
  {
    key: "metrics",
    label: "Metrics",
    icon: "metrics",
    permissions: [{ key: "metrics:manage", label: "Create & edit metrics" }],
  },
  {
    key: "members",
    label: "Members",
    icon: "members",
    permissions: [
      { key: "members:invite", label: "Invite members" },
      { key: "members:manage", label: "Change roles & scope" },
      { key: "members:remove", label: "Remove members" },
    ],
  },
  {
    key: "projects",
    label: "Projects",
    icon: "projects",
    permissions: [
      { key: "projects:create", label: "Create projects" },
      { key: "projects:manage", label: "Manage project settings" },
      { key: "projects:delete", label: "Delete projects" },
    ],
  },
  {
    key: "org",
    label: "Organization",
    icon: "org",
    permissions: [
      { key: "org:billing", label: "Manage billing" },
      { key: "org:settings", label: "Edit organization settings" },
      { key: "org:delete", label: "Delete organization" },
    ],
  },
];

export const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap((g) => g.permissions.map((p) => p.key));
export const PERMISSION_COUNT = ALL_PERMISSIONS.length;

// token segment used for the role's colour dot/badge
export type RoleColor = "primary" | "ok" | "warn" | "danger" | "muted-foreground";

export type Role = {
  id: string;
  name: string;
  description: string;
  color: RoleColor;
  system?: boolean; // built-in: cannot be deleted
  locked?: boolean; // cannot be edited (Owner)
  members: number;
  permissions: string[];
};

const ADMIN_PERMS = ALL_PERMISSIONS.filter((p) => p !== "org:billing" && p !== "org:delete");

export const DEFAULT_ROLES: Role[] = [
  {
    id: "owner",
    name: "Owner",
    description: "Full access to everything, including billing and deleting the organization.",
    color: "primary",
    system: true,
    locked: true,
    members: 1,
    permissions: ALL_PERMISSIONS,
  },
  {
    id: "admin",
    name: "Admin",
    description: "Manage projects, members, and issues. No billing or org deletion.",
    color: "ok",
    system: true,
    members: 1,
    permissions: ADMIN_PERMS,
  },
  {
    id: "member",
    name: "Member",
    description: "Triage and resolve issues across assigned projects.",
    color: "warn",
    members: 2,
    permissions: ["nav:overview", "nav:projects", "nav:issues", "nav:metrics", "issues:resolve", "issues:assign", "metrics:manage"],
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access to assigned projects.",
    color: "muted-foreground",
    members: 1,
    permissions: ["nav:overview", "nav:projects", "nav:issues", "nav:metrics"],
  },
];
