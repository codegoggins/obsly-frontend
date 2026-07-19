// mock overview data — KPIs, chart series, heatmap, insights, projects
import { series } from "@/lib/series";

// icon keys are resolved to lucide components in the UI, keeping data React-free
export type KpiTone = "danger" | "warn" | "brand" | "ok";

export type Kpi = {
  icon: "bug" | "flame" | "clock" | "zap";
  label: string;
  value: string;
  delta: number;
  deltaGood?: boolean;
  sub: string;
  tone: KpiTone;
  spark: number[];
};

export const KPIS: Kpi[] = [
  { icon: "bug", label: "Errors (24h)", value: "3,142", delta: 28, sub: "412 users affected", tone: "danger", spark: series(40, 70, 90, 14) },
  { icon: "flame", label: "Error rate", value: "1.7%", delta: 6, sub: "of 184k events", tone: "warn", spark: series(40, 30, 22, 7) },
  { icon: "clock", label: "P95 latency", value: "842ms", delta: -12, deltaGood: true, sub: "checkout-api", tone: "brand", spark: series(40, 50, 30, 19) },
  { icon: "zap", label: "Apdex", value: "0.94", delta: 2, deltaGood: true, sub: "target 0.95", tone: "ok", spark: series(40, 60, 14, 23) },
];

// the AI "what's happening" hero narration (markdown-lite: **bold** and `code`)
export const HERO_TEXT =
  "Your error rate **tripled at 14:00** — driven almost entirely by **OBS-4821**, a `TypeError` in `CartSummary.computeTotal` that shipped with release **2.14.0**. It has hit **412 users** on `/checkout` in the last 4 hours and is still climbing. Latency and throughput look healthy elsewhere.";

// error volume with the 2pm spike injected, plus the anomaly marker index
export const ERROR_SERIES = (() => {
  const base = series(48, 24, 30, 5);
  for (let i = 30; i < 36; i++) base[i] += 60 + (i - 30) * 14;
  return base;
})();
export const ERROR_ANOMALY = [{ i: 33 }];

export type Insight = {
  tone: "danger" | "warn" | "brand";
  icon: "trend" | "clock" | "user" | "check";
  title: string;
  body: string;
  cta: string;
  href: string;
};

export const INSIGHTS: Insight[] = [
  {
    tone: "danger",
    icon: "trend",
    title: "Errors tripled at 2:00pm",
    body: "A new TypeError on /checkout is responsible for 88% of the spike. It correlates 1:1 with release 2.14.0 rolling out to 50% of traffic.",
    cta: "Open root cause",
    href: "/issues",
  },
  {
    tone: "warn",
    icon: "clock",
    title: "checkout-api p95 creeping up",
    body: "Database pool saturation is pushing p95 from 610ms → 842ms over 3 days. 12 timeouts in the last hour.",
    cta: "View timings",
    href: "/metrics",
  },
  {
    tone: "brand",
    icon: "user",
    title: "One user hit 9 different errors",
    body: "user_8841 is generating noise across 4 issues — likely a corrupted local session, not a product bug. Consider grouping.",
    cta: "Inspect session",
    href: "/issues",
  },
  {
    tone: "brand",
    icon: "check",
    title: "OBS-4711 looks resolved",
    body: "No new events for RangeError in deepClone since the 2.13.4 hotfix 2 days ago. Safe to auto-resolve.",
    cta: "Resolve issue",
    href: "/issues",
  },
];

export type Project = {
  id: string;
  name: string;
  platform: string;
  errors: number;
  status: "healthy" | "degraded";
};

export const PROJECTS: Project[] = [
  { id: "web-storefront", name: "web-storefront", platform: "Next.js", errors: 2140, status: "degraded" },
  { id: "checkout-api", name: "checkout-api", platform: "Node", errors: 681, status: "degraded" },
  { id: "mobile-ios", name: "mobile-ios", platform: "Swift", errors: 188, status: "healthy" },
  { id: "edge-workers", name: "edge-workers", platform: "Cloudflare", errors: 41, status: "healthy" },
];
