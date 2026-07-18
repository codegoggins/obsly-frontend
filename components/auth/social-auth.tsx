"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setToken } from "@/lib/auth";
import { ProviderButton } from "@/components/ui/provider-button";
import { GoogleMark, GitHubMark } from "@/components/brand-marks";

export function SocialAuth() {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  // demo: pretend the OAuth round-trip succeeded, then enter the app
  const run = (which: string) => {
    setBusy(which);
    setToken();
    setTimeout(() => router.push("/"), 900);
  };

  return (
    <div className="grid grid-cols-2 gap-2.5">
      <ProviderButton
        icon={<GoogleMark />}
        label="Google"
        busy={busy === "google"}
        disabled={!!busy}
        onClick={() => run("google")}
      />
      <ProviderButton
        icon={<GitHubMark />}
        label="GitHub"
        busy={busy === "github"}
        disabled={!!busy}
        onClick={() => run("github")}
      />
    </div>
  );
}
