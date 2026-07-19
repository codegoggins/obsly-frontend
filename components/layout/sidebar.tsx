"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Bug, LineChart, Rocket, Settings, LogOut } from "lucide-react";
import { clearToken } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { LiveDot } from "@/components/live-dot";

const NAV = [
  { href: "/", label: "Overview", icon: LayoutGrid },
  { href: "/issues", label: "Issues", icon: Bug, badge: "5" },
  { href: "/metrics", label: "Metrics", icon: LineChart },
  { href: "/onboarding", label: "Setup", icon: Rocket },
  { href: "/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    clearToken();
    router.push("/login");
  };

  return (
    <aside className="hidden h-full w-60 shrink-0 flex-col border-r border-border bg-card/40 md:flex">
      <div className="flex h-14 items-center px-4">
        <Logo />
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-2.5 py-2 text-[0.8125rem] font-medium transition-colors",
                active
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <item.icon size={16} />
              {item.label}
              {item.badge && (
                <span
                  className={cn(
                    "ml-auto rounded-full px-1.5 py-0.5 text-[0.6875rem] font-medium",
                    active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 mb-3 rounded-lg border border-border bg-card p-3">
        <div className="flex items-center gap-2 text-[0.75rem] font-medium">
          <LiveDot /> Obsly is watching
        </div>
        <p className="mt-1 text-[0.6875rem] leading-relaxed text-muted-foreground">
          Monitoring 4 projects · last event 12s ago
        </p>
      </div>

      <div className="flex items-center gap-2.5 border-t border-border px-3 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[0.6875rem] font-semibold">
          MR
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[0.75rem] font-medium">Mara Reyes</div>
          <div className="truncate text-[0.65625rem] text-muted-foreground">mara@acme.io</div>
        </div>
        <button
          onClick={logout}
          aria-label="Log out"
          className="ring-focus flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-danger/12 hover:text-danger"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
