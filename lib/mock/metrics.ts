// mock custom time-series metrics for the metrics page
import { series } from "@/lib/series";

export const NPTS = 48;

export type MetricType = "counter" | "gauge" | "timing";
export type SeriesTone = "brand" | "danger" | "warn" | "ok" | "muted";

export type MetricSeries = {
  key: string;
  label: string;
  tone: SeriesTone;
  type: "area" | "line";
  data: number[];
  emphasis?: boolean;
  dim?: boolean;
};

export type MetricAnomaly = {
  i: number; // point index
  series?: number; // which series the marker sits on
  title: string;
  summary: string; // one-line hook for the card
  detail: string;
  signal: string;
};

export type Metric = {
  name: string;
  type: MetricType;
  value: number;
  unit: string;
  good: "up" | "down";
  delta: number;
  featured?: boolean;
  fmtBig?: boolean;
  tags: string[];
  p?: { p50: number; p95: number; p99: number };
  series: MetricSeries[];
  anomalies: MetricAnomaly[];
};

// bump a window of points to inject a spike, decaying over `span`
function spike(arr: number[], at: number, mult: number, span: number) {
  const out = arr.slice();
  for (let i = at; i < Math.min(arr.length, at + span); i++) {
    const f = 1 - (i - at) / span;
    out[i] = Math.round(out[i] * (1 + (mult - 1) * f));
  }
  return out;
}

export const COUNTERS: Metric[] = [
  {
    name: "checkout.completed", type: "counter", value: 8421, unit: "", good: "up", delta: 6.2,
    tags: ["route:/checkout", "env:production", "plan:pro"],
    series: [{ key: "v", label: "completed", tone: "ok", type: "area", data: series(NPTS, 160, 90, 14) }],
    anomalies: [],
  },
  {
    name: "errors.total", type: "counter", value: 3142, unit: "", good: "down", delta: 28,
    tags: ["status:5xx", "env:production", "route:/checkout"],
    series: [{ key: "v", label: "errors", tone: "danger", type: "area", data: spike(series(NPTS, 40, 26, 5), 28, 4.1, 8) }],
    anomalies: [{ i: 29, title: "errors.total spiked 3.1×", summary: "a new TypeError on /checkout shipped with release 2.14.0", detail: "A new TypeError on /checkout (OBS-4821) began firing with release 2.14.0.", signal: "OBS-4821 · /checkout" }],
  },
  {
    name: "api.requests", type: "counter", value: 1240000, unit: "", good: "up", fmtBig: true, delta: 3.4,
    tags: ["env:production", "region:us-east"],
    series: [{ key: "v", label: "requests", tone: "brand", type: "area", data: series(NPTS, 220, 70, 31) }],
    anomalies: [],
  },
  {
    name: "jobs.processed", type: "counter", value: 52340, unit: "", good: "up", delta: 1.1,
    tags: ["env:production"],
    series: [{ key: "v", label: "jobs", tone: "brand", type: "area", data: series(NPTS, 120, 40, 9) }],
    anomalies: [],
  },
];

export const GAUGES: Metric[] = [
  {
    name: "queue.depth", type: "gauge", value: 142, unit: "", good: "down", delta: 18,
    tags: ["env:production", "status:5xx"],
    series: [{ key: "v", label: "depth", tone: "warn", type: "line", emphasis: true, data: spike(series(NPTS, 40, 22, 7), 30, 3.4, 10) }],
    anomalies: [{ i: 33, title: "queue.depth climbing", summary: "backlog growing ~12/min and not draining after a deploy", detail: "Worker throughput dropped after a deploy; backlog is growing ~12/min and not draining.", signal: "checkout-api · deploy 2.14.0" }],
  },
  {
    name: "cpu.utilization", type: "gauge", value: 63, unit: "%", good: "down", delta: -4,
    tags: ["env:production", "region:us-east"],
    series: [{ key: "v", label: "cpu %", tone: "brand", type: "line", emphasis: true, data: series(NPTS, 55, 24, 19).map((v) => Math.min(98, v)) }],
    anomalies: [],
  },
  {
    name: "memory.rss", type: "gauge", value: 1840, unit: "MB", good: "down", delta: 7,
    tags: ["env:production"],
    series: [{ key: "v", label: "rss", tone: "brand", type: "line", emphasis: true, data: series(NPTS, 60, 18, 23) }],
    anomalies: [],
  },
  {
    name: "active.sessions", type: "gauge", value: 4206, unit: "", good: "up", delta: 2.3,
    tags: ["env:production", "plan:pro"],
    series: [{ key: "v", label: "sessions", tone: "ok", type: "line", emphasis: true, data: series(NPTS, 70, 28, 11) }],
    anomalies: [],
  },
];

const lat50 = series(NPTS, 30, 10, 3).map((v) => 180 + v);
const lat95 = spike(series(NPTS, 60, 18, 7).map((v) => 700 + v * 2), 28, 1.9, 9);
const lat99 = spike(series(NPTS, 80, 22, 13).map((v) => 1100 + v * 3), 28, 2.6, 9);

export const TIMINGS: Metric[] = [
  {
    name: "checkout.latency", type: "timing", value: 842, unit: "ms", good: "down", featured: true, delta: 23,
    tags: ["route:/checkout", "env:production", "region:us-east"],
    p: { p50: 210, p95: 842, p99: 1430 },
    series: [
      { key: "p99", label: "p99", tone: "danger", type: "line", data: lat99 },
      { key: "p95", label: "p95", tone: "warn", type: "line", emphasis: true, data: lat95 },
      { key: "p50", label: "p50", tone: "ok", type: "line", data: lat50, dim: true },
    ],
    anomalies: [{ i: 28, series: 0, title: "checkout.latency spiked 3.2×", summary: "p95 jumped 720ms → 2.3s at 14:05, likely DB pool saturation", detail: "p95 jumped 720ms → 2.3s at 14:05, the same minute errors spiked on /checkout. Likely DB pool saturation under the empty-cart retry storm.", signal: "errors.total · queue.depth" }],
  },
  {
    name: "db.query.time", type: "timing", value: 45, unit: "ms", good: "down", delta: 9,
    tags: ["env:production", "region:us-east"],
    p: { p50: 8, p95: 45, p99: 120 },
    series: [
      { key: "p99", label: "p99", tone: "danger", type: "line", data: series(NPTS, 40, 14, 17).map((v) => 100 + v) },
      { key: "p95", label: "p95", tone: "warn", type: "line", emphasis: true, data: series(NPTS, 24, 10, 7).map((v) => 35 + v) },
      { key: "p50", label: "p50", tone: "ok", type: "line", data: series(NPTS, 10, 5, 3).map((v) => 6 + v / 4), dim: true },
    ],
    anomalies: [],
  },
];

export const ALL_METRICS: Metric[] = [...TIMINGS, ...COUNTERS, ...GAUGES];

// tag chips shown in the filter bar, with counts derived from the data
export const TAG_FILTERS = ["route:/checkout", "env:production", "status:5xx", "region:us-east", "plan:pro"].map((key) => ({
  key,
  count: ALL_METRICS.filter((m) => m.tags.includes(key)).length,
}));

// per-point clock labels for chart tooltips (48 points across 24h)
export const X_24H_FULL = Array.from({ length: NPTS }, (_, i) => {
  if (i === NPTS - 1) return "now";
  const totalMin = Math.round((i / (NPTS - 1)) * 1440);
  const hh = String(Math.floor(totalMin / 60) % 24).padStart(2, "0");
  const mm = String(totalMin % 60).padStart(2, "0");
  return `${hh}:${mm}`;
});

export function fmtMs(v: number) {
  return v >= 1000 ? `${(v / 1000).toFixed(2)}s` : `${Math.round(v)}ms`;
}

export function fmtBigNum(v: number) {
  if (v >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)}k`;
  return v.toLocaleString();
}
