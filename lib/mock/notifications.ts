// mock activity feed shown in the topbar notifications panel
export type NotifTone = "warn" | "danger" | "brand" | "ok";

export type Notification = {
  id: string;
  tone: NotifTone;
  icon: "spark" | "bug" | "flame" | "refresh" | "user" | "rocket" | "check";
  title: string;
  body: string;
  time: string;
  unread: boolean;
  href: string;
};

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", tone: "warn", icon: "spark", title: "Anomaly: checkout.latency spiked 3.2×", body: "p95 jumped 720ms → 2.3s at 14:05, correlated with /checkout errors.", time: "2m", unread: true, href: "/metrics" },
  { id: "n2", tone: "danger", icon: "bug", title: "New issue · OBS-4821", body: "TypeError: Cannot read properties of undefined (reading 'total')", time: "4m", unread: true, href: "/issues/OBS-4821" },
  { id: "n3", tone: "warn", icon: "flame", title: "Errors up 28% in the last hour", body: "3,142 events across 4 issues on web-storefront.", time: "1h", unread: true, href: "/" },
  { id: "n4", tone: "danger", icon: "refresh", title: "Regression · OBS-4790 reopened", body: "TimeoutError started happening again after release 2.14.0.", time: "1h", unread: false, href: "/issues/OBS-4790" },
  { id: "n5", tone: "brand", icon: "user", title: "Mara mentioned you", body: "“can you take a look at the card_declined spike?” on OBS-4815", time: "3h", unread: false, href: "/issues/OBS-4815" },
  { id: "n6", tone: "brand", icon: "rocket", title: "Release 2.14.0 deployed", body: "Shipped to production · 50% rollout. Obsly is watching.", time: "4h", unread: false, href: "/metrics" },
  { id: "n7", tone: "ok", icon: "check", title: "OBS-4711 auto-resolved", body: "No new events for RangeError in deepClone since the 2.13.4 hotfix.", time: "2d", unread: false, href: "/issues" },
];
