// mock data for the settings screens

export const ORG = {
  name: "Acme Inc",
  slug: "acme",
  plan: "Pro",
  seats: { used: 6, total: 10 },
  initial: "A",
};

export type ProjectRow = {
  id: string;
  name: string;
  platform: string;
  env: string;
  status: "healthy" | "degraded";
  members: number;
  events: string;
};

export const SETTINGS_PROJECTS: ProjectRow[] = [
  { id: "web-storefront", name: "web-storefront", platform: "Next.js", env: "production", status: "degraded", members: 6, events: "184k" },
  { id: "checkout-api", name: "checkout-api", platform: "Node", env: "production", status: "degraded", members: 4, events: "92k" },
  { id: "mobile-ios", name: "mobile-ios", platform: "Swift", env: "production", status: "healthy", members: 3, events: "41k" },
  { id: "edge-workers", name: "edge-workers", platform: "Cloudflare", env: "staging", status: "healthy", members: 2, events: "8k" },
];

export type MemberRole = "Owner" | "Admin" | "Member" | "Viewer";

export type Member = {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  initials: string;
  tone: string;
  lastActive: string;
};

export const MEMBERS: Member[] = [
  { id: "mara", name: "Mara Reyes", email: "mara@acme.io", role: "Owner", initials: "MR", tone: "bg-primary/15 text-primary", lastActive: "now" },
  { id: "dev", name: "Dev Patel", email: "dev@acme.io", role: "Admin", initials: "DV", tone: "bg-warn/15 text-warn", lastActive: "12m ago" },
  { id: "sara", name: "Sara Lin", email: "sara@acme.io", role: "Member", initials: "SL", tone: "bg-ok/15 text-ok", lastActive: "2h ago" },
  { id: "tom", name: "Tom Okafor", email: "tom@acme.io", role: "Member", initials: "TO", tone: "bg-danger/15 text-danger", lastActive: "1d ago" },
  { id: "nina", name: "Nina Costa", email: "nina@acme.io", role: "Viewer", initials: "NC", tone: "bg-primary/15 text-primary", lastActive: "3d ago" },
];

export type Invite = {
  id: string;
  email: string;
  role: MemberRole;
  sentAgo: string;
};

export const INVITES: Invite[] = [
  { id: "i1", email: "arjun@acme.io", role: "Member", sentAgo: "sent 2d ago" },
  { id: "i2", email: "lea@contractor.dev", role: "Viewer", sentAgo: "sent 5h ago" },
];

export const ROLES: MemberRole[] = ["Owner", "Admin", "Member", "Viewer"];

export type Session = {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
};

export const SESSIONS: Session[] = [
  { id: "s1", device: "MacBook Pro", browser: "Chrome 141", location: "Bengaluru, IN", ip: "103.42.18.7", lastActive: "Active now", current: true },
  { id: "s2", device: "iPhone 15", browser: "Safari (iOS)", location: "Bengaluru, IN", ip: "103.42.18.9", lastActive: "3h ago", current: false },
  { id: "s3", device: "Windows PC", browser: "Edge 140", location: "Mumbai, IN", ip: "49.36.220.5", lastActive: "2d ago", current: false },
];
