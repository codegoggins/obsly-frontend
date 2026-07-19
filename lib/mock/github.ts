// mock GitHub connection state + repos available to import as new projects
export const GITHUB = {
  connected: true,
  account: "codegoggins",
  org: "acme",
};

export type Repo = {
  full: string; // "acme/marketing-site"
  language: string;
  private: boolean;
  pushedAgo: string;
};

// repos not yet linked to a project
export const IMPORTABLE_REPOS: Repo[] = [
  { full: "acme/marketing-site", language: "Next.js", private: false, pushedAgo: "2h ago" },
  { full: "acme/admin-portal", language: "React", private: true, pushedAgo: "1d ago" },
  { full: "acme/data-pipeline", language: "Node", private: true, pushedAgo: "3d ago" },
  { full: "acme/design-system", language: "TypeScript", private: false, pushedAgo: "5d ago" },
  { full: "acme/notifications-svc", language: "Go", private: true, pushedAgo: "1w ago" },
];
