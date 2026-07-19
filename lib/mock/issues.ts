// mock issue feed — shared by the overview and (later) the issues list
import { series } from "@/lib/series";

export type IssueLevel = "error" | "warning";
export type IssueStatus = "unresolved" | "resolved";
export type IssueOrigin = "frontend" | "backend";

export type Issue = {
  id: string;
  title: string;
  culprit: string;
  type: string;
  level: IssueLevel;
  status: IssueStatus;
  origin: IssueOrigin;
  handled: boolean;
  assignee: "mara" | "dev" | null;
  events: number;
  users: number;
  env: string;
  release: string;
  firstSeen: string;
  lastSeen: string;
  trend: number;
  spark: number[];
};

export const ISSUES: Issue[] = [
  {
    id: "OBS-4821",
    title: "TypeError: Cannot read properties of undefined (reading 'total')",
    culprit: "checkout/CartSummary.tsx in computeTotal",
    type: "TypeError",
    level: "error",
    status: "unresolved",
    origin: "frontend",
    handled: false,
    assignee: null,
    events: 1248,
    users: 412,
    env: "production",
    release: "2.14.0",
    firstSeen: "4h ago",
    lastSeen: "12s ago",
    trend: 212,
    spark: series(28, 30, 60, 11),
  },
  {
    id: "OBS-4815",
    title: "PaymentDeclinedError: card_declined at /api/checkout/charge",
    culprit: "api/checkout/charge.ts in chargeCard",
    type: "PaymentDeclinedError",
    level: "error",
    status: "unresolved",
    origin: "backend",
    handled: true,
    assignee: "mara",
    events: 643,
    users: 287,
    env: "production",
    release: "2.14.0",
    firstSeen: "1d ago",
    lastSeen: "1m ago",
    trend: 18,
    spark: series(28, 22, 26, 3),
  },
  {
    id: "OBS-4790",
    title: "TimeoutError: upstream request timed out after 30000ms",
    culprit: "lib/db/pool.ts in withConnection",
    type: "TimeoutError",
    level: "error",
    status: "unresolved",
    origin: "backend",
    handled: false,
    assignee: null,
    events: 318,
    users: 96,
    env: "production",
    release: "2.13.4",
    firstSeen: "3d ago",
    lastSeen: "6m ago",
    trend: -7,
    spark: series(28, 14, 30, 21),
  },
  {
    id: "OBS-4772",
    title: "Warning: validateDOMNesting <tr> cannot appear as a child of <div>",
    culprit: "components/Table.tsx in TableRow",
    type: "Warning",
    level: "warning",
    status: "unresolved",
    origin: "frontend",
    handled: true,
    assignee: null,
    events: 209,
    users: 188,
    env: "staging",
    release: "2.15.0-rc1",
    firstSeen: "2d ago",
    lastSeen: "22m ago",
    trend: 3,
    spark: series(28, 9, 12, 9),
  },
  {
    id: "OBS-4760",
    title: "NetworkError: Failed to fetch /api/analytics/track",
    culprit: "lib/analytics.ts in track",
    type: "NetworkError",
    level: "warning",
    status: "unresolved",
    origin: "frontend",
    handled: true,
    assignee: "dev",
    events: 174,
    users: 140,
    env: "production",
    release: "2.14.0",
    firstSeen: "5d ago",
    lastSeen: "34m ago",
    trend: 1,
    spark: series(28, 7, 10, 33),
  },
  {
    id: "OBS-4711",
    title: "RangeError: Maximum call stack size exceeded",
    culprit: "utils/serialize.ts in deepClone",
    type: "RangeError",
    level: "error",
    status: "resolved",
    origin: "backend",
    handled: false,
    assignee: "mara",
    events: 88,
    users: 41,
    env: "production",
    release: "2.13.4",
    firstSeen: "8d ago",
    lastSeen: "2d ago",
    trend: -94,
    spark: series(28, 5, 8, 5),
  },
];
