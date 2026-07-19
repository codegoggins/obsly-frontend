"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Sparkles, Bug, Flame, RefreshCw, User, Rocket, Check, Settings, type LucideIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Segmented } from "@/components/ui/segmented";
import { LiveDot } from "@/components/live-dot";
import { cn } from "@/lib/utils";
import { NOTIFICATIONS, type Notification } from "@/lib/mock/notifications";

const ICONS: Record<Notification["icon"], LucideIcon> = {
  spark: Sparkles,
  bug: Bug,
  flame: Flame,
  refresh: RefreshCw,
  user: User,
  rocket: Rocket,
  check: Check,
};

const TONE_BG = {
  warn: "bg-warn/12 text-warn",
  danger: "bg-danger/12 text-danger",
  brand: "bg-primary/12 text-primary",
  ok: "bg-ok/12 text-ok",
};

export function Notifications() {
  const router = useRouter();
  const [items, setItems] = useState(NOTIFICATIONS);
  const [tab, setTab] = useState("all");
  const [open, setOpen] = useState(false);

  const unread = items.filter((i) => i.unread).length;
  const shown = tab === "unread" ? items.filter((i) => i.unread) : items;
  const markAll = () => setItems((xs) => xs.map((x) => ({ ...x, unread: false })));

  const openNotif = (n: Notification) => {
    setItems((xs) => xs.map((x) => (x.id === n.id ? { ...x, unread: false } : x)));
    setOpen(false);
    router.push(n.href);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label="Notifications"
        className={cn(
          "ring-focus relative flex h-9 w-9 items-center justify-center rounded-md transition-colors",
          open ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
        )}
      >
        <Bell size={17} />
        {unread > 0 && <LiveDot tone="danger" size={7} className="absolute right-1.5 top-1.5" />}
      </PopoverTrigger>

      <PopoverContent align="end" className="w-96">
        {/* header */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="text-sm font-semibold">Notifications</span>
          {unread > 0 && <Badge tone="brand">{unread} new</Badge>}
          <button
            onClick={markAll}
            className="ml-auto flex items-center gap-1 whitespace-nowrap text-[0.75rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Check size={12} /> Mark all read
          </button>
        </div>

        {/* tabs */}
        <div className="px-3 pt-2.5">
          <Segmented
            value={tab}
            onChange={setTab}
            options={[
              { value: "all", label: "All" },
              { value: "unread", label: unread > 0 ? `Unread · ${unread}` : "Unread" },
            ]}
          />
        </div>

        {/* list */}
        <div className="max-h-[24rem] overflow-y-auto p-1.5">
          {shown.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Check size={18} />
              </span>
              <div className="text-[0.8125rem] font-medium">You&apos;re all caught up</div>
              <div className="text-[0.71875rem] text-muted-foreground">No unread notifications.</div>
            </div>
          ) : (
            shown.map((n) => {
              const Icon = ICONS[n.icon];
              return (
                <button
                  key={n.id}
                  onClick={() => openNotif(n)}
                  className="group relative flex w-full gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors hover:bg-accent"
                >
                  <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", TONE_BG[n.tone])}>
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className={cn("min-w-0 flex-1 truncate text-[0.78125rem] leading-snug", n.unread ? "font-semibold text-foreground" : "font-medium text-foreground/80")}>
                        {n.title}
                      </span>
                      <span className="shrink-0 whitespace-nowrap font-mono text-[0.65625rem] text-muted-foreground">{n.time}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 pr-3 text-[0.71875rem] leading-relaxed text-muted-foreground">{n.body}</p>
                  </div>
                  {n.unread && <span className="absolute right-2.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary" />}
                </button>
              );
            })
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between border-t border-border px-3 py-2.5">
          <button
            onClick={() => {
              setOpen(false);
              router.push("/settings");
            }}
            className="flex items-center gap-1.5 text-[0.75rem] text-muted-foreground transition-colors hover:text-foreground"
          >
            <Settings size={13} /> Preferences
          </button>
          <button
            onClick={() => {
              setOpen(false);
              router.push("/");
            }}
            className="text-[0.75rem] font-medium text-primary hover:underline"
          >
            View all activity
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
