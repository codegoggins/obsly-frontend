import { ThemeToggle } from "@/components/theme-toggle";
import { CommandMenu } from "@/components/layout/command-menu";
import { Notifications } from "@/components/layout/notifications";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-5 backdrop-blur-md">
      <CommandMenu />

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-full border border-ok/25 bg-ok/15 px-2 py-0.5 text-[0.6875rem] font-medium text-ok lg:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-ok" /> all systems operational
        </span>
        <Notifications />
        <ThemeToggle />
      </div>
    </header>
  );
}
