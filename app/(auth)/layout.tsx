import { Logo } from "@/components/logo";
import { LiveDot } from "@/components/live-dot";
import { Showcase } from "@/components/auth/showcase";
import { AuthTopLink } from "@/components/auth/auth-top-link";

// shared split-screen shell for every auth page
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Showcase />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between px-6 py-5 sm:px-10">
          <div className="lg:invisible">
            <Logo />
          </div>
          <AuthTopLink />
        </div>

        <div className="flex flex-1 items-center justify-center overflow-y-auto px-6 py-8 sm:px-10">
          {children}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-5 text-xs text-muted-foreground sm:px-10">
          <span>© 2026 codegoggins</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-foreground">Privacy</span>
            <span className="hover:text-foreground">Terms</span>
            <span className="flex items-center gap-1.5">
              <LiveDot /> All systems operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
