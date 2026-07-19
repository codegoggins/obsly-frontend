import { Globe, Server, Smartphone, Cloud, Component, type LucideIcon } from "lucide-react";

// map access (not a function call) so it can be used as a component during render
export const PLATFORM_ICONS: Record<string, LucideIcon> = {
  "Next.js": Globe,
  Node: Server,
  Swift: Smartphone,
  Cloudflare: Cloud,
  React: Component,
};

export const FALLBACK_ICON = Globe;
