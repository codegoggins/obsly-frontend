// mock deep-detail data for a single issue: stack, breadcrumbs, request path, AI
import { series } from "@/lib/series";

export type StackLine = { n: number; t: string; err?: boolean };
export type StackFrame = {
  fn: string;
  file: string;
  line: number;
  col: number;
  inApp: boolean;
  context?: StackLine[];
};

export const STACK: StackFrame[] = [
  {
    fn: "computeTotal", file: "app/checkout/CartSummary.tsx", line: 42, col: 18, inApp: true,
    context: [
      { n: 39, t: "  const lineItems = cart.items ?? [];" },
      { n: 40, t: "  const subtotal = lineItems.reduce(" },
      { n: 41, t: "    (sum, item) => sum + item.price * item.qty, 0);" },
      { n: 42, t: "  return subtotal + cart.summary.total * taxRate;", err: true },
      { n: 43, t: "}" },
    ],
  },
  {
    fn: "CartSummary", file: "app/checkout/CartSummary.tsx", line: 71, col: 22, inApp: true,
    context: [
      { n: 69, t: "  const [cart] = useCart();" },
      { n: 70, t: "  // empty cart returns { items: [] } with no summary" },
      { n: 71, t: "  const total = computeTotal(cart);", err: true },
      { n: 72, t: '  return <Row label="Total" value={total} />;' },
    ],
  },
  { fn: "renderWithHooks", file: "node_modules/react-dom/cjs/react-dom.js", line: 16305, col: 18, inApp: false },
  { fn: "mountIndeterminateComponent", file: "node_modules/react-dom/cjs/react-dom.js", line: 20074, col: 13, inApp: false },
  { fn: "beginWork", file: "node_modules/react-dom/cjs/react-dom.js", line: 21587, col: 16, inApp: false },
];

export type BreadcrumbLevel = "info" | "warning" | "error";
export type Breadcrumb = {
  t: string;
  cat: "navigation" | "ui.click" | "http" | "state" | "render";
  level: BreadcrumbLevel;
  msg: string;
  data: string;
};

export const BREADCRUMBS: Breadcrumb[] = [
  { t: "0ms", cat: "navigation", level: "info", msg: "Navigated to /checkout", data: "from /cart" },
  { t: "+1.2s", cat: "ui.click", level: "info", msg: 'Clicked button "Apply promo code"', data: "#promo-apply" },
  { t: "+1.4s", cat: "http", level: "info", msg: "POST /api/cart/promo → 200", data: "142ms" },
  { t: "+2.1s", cat: "ui.click", level: "info", msg: 'Clicked button "Remove item"', data: "sku_8841" },
  { t: "+2.1s", cat: "state", level: "warning", msg: "cart.summary set to undefined", data: "reducer: REMOVE_LAST_ITEM" },
  { t: "+2.2s", cat: "render", level: "error", msg: "Exception in CartSummary.computeTotal", data: "OBS-4821" },
];

export const AI_ROOTCAUSE = `When the **last item** is removed from the cart, the \`REMOVE_LAST_ITEM\` reducer sets \`cart.summary\` to \`undefined\` instead of an empty summary object. \`computeTotal()\` then reads \`cart.summary.total\`, throwing on the now-undefined \`summary\`.

This started in release **2.14.0**, which shipped the new promo-code reducer. 97% of occurrences are on **/checkout** in **production**, and every one follows a "remove last item" breadcrumb.`;

export const AI_FIX = `// app/checkout/CartSummary.tsx — line 42
- return subtotal + cart.summary.total * taxRate;
+ return subtotal + (cart.summary?.total ?? 0) * taxRate;`;

export type IssueOrigin = "frontend" | "backend";

export type IssueTrigger = { page: string; route: string; element: string; component: string };

export type IssueDetail = {
  origin: IssueOrigin;
  layman: string;
  impact: string;
  api: { method: string; path: string; status: string } | null;
  backend: { service: string; runtime: string; file: string; handler: string; line: number; note: string } | null;
  triggers: IssueTrigger[];
};

export const ISSUE_DETAILS: Record<string, IssueDetail> = {
  "OBS-4821": {
    origin: "frontend",
    layman: "When a shopper removes the **last item** from their cart, the checkout page tries to add up a total that no longer exists — so the page crashes and they can't pay. Everyone who empties their cart on /checkout hits this.",
    impact: "412 shoppers blocked at checkout in the last 4 hours",
    api: { method: "DELETE", path: "/api/cart/items/:sku", status: "200 OK" },
    backend: { service: "checkout-api", runtime: "Node 20", file: "api/cart/items.ts", handler: "removeItem", line: 63, note: "Backend responds normally — the crash is on the client after the response." },
    triggers: [
      { page: "Checkout", route: "/checkout", element: "“Remove item” button", component: "CartSummary.tsx" },
      { page: "Cart", route: "/cart", element: "Trash icon on a line item", component: "CartLineItem.tsx" },
    ],
  },
  "OBS-4815": {
    origin: "backend",
    layman: "The shopper's **bank declined the payment**. Our checkout service correctly stops the order, but it logs every decline as a crash — which is why the error count looks scary. Most of these are normal declined cards, not a bug.",
    impact: "287 shoppers saw a failed-payment message",
    api: { method: "POST", path: "/api/checkout/charge", status: "402 Payment Required" },
    backend: { service: "checkout-api", runtime: "Node 20", file: "api/checkout/charge.ts", handler: "chargeCard", line: 88, note: "Throws a hard error instead of returning a handled “declined” result." },
    triggers: [{ page: "Checkout", route: "/checkout", element: "“Pay now” button", component: "PaymentForm.tsx" }],
  },
  "OBS-4790": {
    origin: "backend",
    layman: "During busy periods our **database runs out of free connections**, so some requests wait too long and give up. Users see a spinner that never finishes when opening an order.",
    impact: "96 users hit stalled requests, mostly at peak hours",
    api: { method: "GET", path: "/api/orders/:id", status: "504 Gateway Timeout" },
    backend: { service: "checkout-api", runtime: "Node 20", file: "lib/db/pool.ts", handler: "withConnection", line: 51, note: "Connection pool exhausted — waiters time out after 30s." },
    triggers: [
      { page: "Order history", route: "/orders", element: "“View order” button", component: "OrderList.tsx" },
      { page: "Order confirmation", route: "/checkout/success", element: "Auto-loads on open", component: "OrderSummary.tsx" },
    ],
  },
  "OBS-4772": {
    origin: "frontend",
    layman: "An admin table is built with **invalid HTML structure**. It still shows up, but React complains and it can cause small layout glitches in some browsers. Harmless to shoppers.",
    impact: "Cosmetic — no user-facing failure",
    api: null,
    backend: null,
    triggers: [{ page: "Admin dashboard", route: "/admin", element: "Orders data table", component: "Table.tsx" }],
  },
  "OBS-4760": {
    origin: "frontend",
    layman: "**Analytics tracking calls are failing** — usually because an ad blocker cancels them. Shopping still works fine, but it makes our analytics numbers unreliable and adds noise.",
    impact: "No effect on shopping — skews analytics only",
    api: { method: "POST", path: "/api/analytics/track", status: "net::ERR_BLOCKED" },
    backend: { service: "analytics-worker", runtime: "Cloudflare", file: "ingest/track.ts", handler: "collect", line: 24, note: "Request never reaches the worker — blocked in the browser." },
    triggers: [{ page: "Every page", route: "*", element: "Page views & click events", component: "analytics.ts" }],
  },
  "OBS-4711": {
    origin: "backend",
    layman: "A helper that copies data got stuck in an **endless loop** when the data pointed back at itself, using up all memory until the request crashed. Already fixed in the 2.13.4 hotfix.",
    impact: "Resolved — no new events in 2 days",
    api: { method: "POST", path: "/api/cart/sync", status: "500 Internal Server Error" },
    backend: { service: "web-storefront", runtime: "Node 20", file: "utils/serialize.ts", handler: "deepClone", line: 17, note: "Recursion had no cycle guard for self-referential objects." },
    triggers: [{ page: "Cart", route: "/cart", element: "“Save for later” button", component: "CartActions.tsx" }],
  },
};

export function getIssueDetail(id: string): IssueDetail {
  return ISSUE_DETAILS[id] ?? ISSUE_DETAILS["OBS-4821"];
}

// deterministic per-issue occurrence series with a spike near the end
export function occurrences(seed: number): number[] {
  return series(40, 18, 26, seed).map((v, i) => (i > 24 ? v + 40 + (i - 24) * 8 : v));
}
