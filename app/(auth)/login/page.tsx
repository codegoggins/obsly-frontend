"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { setToken } from "@/lib/auth";
import { InputField } from "@/components/ui/input-field";
import { OrDivider } from "@/components/ui/or-divider";
import { SubmitButton } from "@/components/ui/submit-button";
import { AuthCard } from "@/components/auth/auth-card";
import { SocialAuth } from "@/components/auth/social-auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = () => {
    // demo: accept any input, store a token, then enter the app
    setBusy(true);
    setToken();
    setTimeout(() => router.push("/"), 700);
  };

  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Sign in to Obsly"
      sub="Pick up where you left off — your projects are still being watched."
    >
      <SocialAuth />
      <OrDivider />
      <div className="space-y-3.5">
        <InputField
          label="Work email"
          type="email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
        />
        <InputField
          label="Password"
          type="password"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          right={
            <Link href="/forgot" className="text-xs font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          }
        />
        <SubmitButton onClick={submit} busy={busy}>
          Sign in <ArrowRight size={15} />
        </SubmitButton>
      </div>
      <p className="text-center text-[0.8125rem] text-muted-foreground">
        New to Obsly?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </AuthCard>
  );
}
