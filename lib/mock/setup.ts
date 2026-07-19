// mock project-setup values shown on the onboarding page
export const DSN = "https://o4821@ingest.obsly.dev/v1/web-storefront";
export const API_KEY = "obs_live_sk_9f3c1a7e42b08d6510fb29ac";

export const INSTALL: Record<string, string> = {
  npm: "npm install @obsly/sdk",
  pnpm: "pnpm add @obsly/sdk",
  yarn: "yarn add @obsly/sdk",
  bun: "bun add @obsly/sdk",
};

export const INIT_SNIPPETS: Record<string, string> = {
  nextjs: `// instrumentation.ts
import { Obsly } from "@obsly/sdk";

Obsly.init({
  dsn: "${DSN}",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});`,
  node: `// server.ts
import { Obsly } from "@obsly/sdk/node";

Obsly.init({
  dsn: "${DSN}",
  environment: "production",
});`,
  react: `// main.tsx
import { Obsly } from "@obsly/sdk/react";

Obsly.init({
  dsn: "${DSN}",
  replaysSessionSampleRate: 0.1,
});`,
};

export const REPOS = [
  { role: "Frontend repo", suggested: "acme/web-storefront", platform: "Next.js", branch: "main" },
  { role: "Backend repo", suggested: "acme/checkout-api", platform: "Node", branch: "main" },
];
