// projects with their own credentials — each project gets a unique DSN + API key
export type ProjectPlatform = "Next.js" | "Node" | "Swift" | "Cloudflare" | "React";

export type Project = {
  id: string;
  name: string;
  platform: ProjectPlatform;
  env: string;
  status: "healthy" | "degraded";
  repo: string | null;
  branch: string;
  dsn: string;
  apiKey: string;
  events24h: string;
  errorRate: string;
  users: number;
  members: number;
  createdAt: string;
};

export const PROJECTS: Project[] = [
  {
    id: "web-storefront", name: "web-storefront", platform: "Next.js", env: "production", status: "degraded",
    repo: "acme/web-storefront", branch: "main",
    dsn: "https://o4821@ingest.obsly.dev/v1/web-storefront",
    apiKey: "obs_live_sk_9f3c1a7e42b08d6510fb29ac",
    events24h: "184k", errorRate: "1.7%", users: 12840, members: 6, createdAt: "Mar 2026",
  },
  {
    id: "checkout-api", name: "checkout-api", platform: "Node", env: "production", status: "degraded",
    repo: "acme/checkout-api", branch: "main",
    dsn: "https://o5514@ingest.obsly.dev/v1/checkout-api",
    apiKey: "obs_live_sk_2b71e0d9c4a6f3128ab5d07e",
    events24h: "92k", errorRate: "0.9%", users: 9210, members: 4, createdAt: "Mar 2026",
  },
  {
    id: "mobile-ios", name: "mobile-ios", platform: "Swift", env: "production", status: "healthy",
    repo: "acme/mobile-ios", branch: "release",
    dsn: "https://o6620@ingest.obsly.dev/v1/mobile-ios",
    apiKey: "obs_live_sk_7d2f83b1e59c0a4462fe1db8",
    events24h: "41k", errorRate: "0.3%", users: 5320, members: 3, createdAt: "Apr 2026",
  },
  {
    id: "edge-workers", name: "edge-workers", platform: "Cloudflare", env: "staging", status: "healthy",
    repo: null, branch: "main",
    dsn: "https://o7788@ingest.obsly.dev/v1/edge-workers",
    apiKey: "obs_live_sk_c1a9047e63b2d8f5104ea27b",
    events24h: "8k", errorRate: "0.1%", users: 640, members: 2, createdAt: "May 2026",
  },
];

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}
