"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// the top-right prompt changes per auth screen
const LINKS: Record<string, { q: string; label: string; to: string }> = {
  "/login": { q: "New here?", label: "Create account", to: "/signup" },
  "/signup": { q: "Have an account?", label: "Sign in", to: "/login" },
  "/forgot": { q: "Remembered it?", label: "Sign in", to: "/login" },
};

export function AuthTopLink() {
  const pathname = usePathname();
  const link = LINKS[pathname] ?? LINKS["/login"];
  return (
    <div className="flex items-center gap-3 text-[0.8125rem]">
      <span className="hidden text-muted-foreground sm:inline">{link.q}</span>
      <Link
        href={link.to}
        className="ring-focus rounded-lg border border-border bg-card px-3.5 py-1.5 font-medium transition-colors hover:bg-accent"
      >
        {link.label}
      </Link>
    </div>
  );
}
