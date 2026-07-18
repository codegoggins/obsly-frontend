"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { setToken } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { SubmitButton } from "@/components/ui/submit-button";
import { AuthCard } from "@/components/auth/auth-card";

const COPY = {
  mfa: {
    eyebrow: "Two-factor authentication",
    title: "Verify it's you",
    sub: "Enter the 6-digit code from your authenticator app.",
  },
  verify: {
    eyebrow: "Confirm your email",
    title: "Check your inbox",
    sub: "We sent a 6-digit code to activate your account.",
  },
  forgot: {
    eyebrow: "Account recovery",
    title: "Enter your code",
    sub: "We sent a 6-digit code to continue resetting your password.",
  },
};

function OtpContent() {
  const router = useRouter();
  const params = useSearchParams();
  const reason = (params.get("reason") ?? "mfa") as keyof typeof COPY;
  const next = params.get("next") ?? "app";
  const email = params.get("email");
  const copy = COPY[reason] ?? COPY.mfa;

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [seconds, setSeconds] = useState(28);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const setDigit = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    setDigits((d) => {
      const next = [...d];
      next[i] = v;
      return next;
    });
    setError(undefined);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const filled = ["", "", "", "", "", ""];
    for (let i = 0; i < text.length; i++) filled[i] = text[i];
    setDigits(filled);
    refs.current[Math.min(text.length, 5)]?.focus();
  };

  const code = digits.join("");
  const submit = () => {
    if (code.length < 6) {
      setError("Enter all 6 digits");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      if (next === "reset") {
        router.push("/reset");
        return;
      }
      setToken();
      router.push("/");
    }, 700);
  };

  return (
    <AuthCard
      eyebrow={copy.eyebrow}
      title={copy.title}
      sub={email ? `${copy.sub} Sent to ${email}.` : copy.sub}
    >
      <div className="space-y-3.5">
        <div className="flex justify-between gap-2" onPaste={onPaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={d}
              inputMode="numeric"
              maxLength={1}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              autoFocus={i === 0}
              className={cn(
                "h-14 w-full rounded-xl border bg-card text-center font-mono text-[1.375rem] font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring/30",
                d ? "border-primary/50 text-foreground" : "border-border text-muted-foreground",
              )}
            />
          ))}
        </div>
        {error && <div className="text-[0.71875rem] text-danger">{error}</div>}
        <SubmitButton onClick={submit} busy={busy}>
          Verify <Check size={15} />
        </SubmitButton>
      </div>
      <div className="flex items-center justify-center gap-1.5 text-[0.78125rem] text-muted-foreground">
        {seconds > 0 ? (
          <span>
            Resend code in{" "}
            <span className="font-mono text-foreground/80">0:{String(seconds).padStart(2, "0")}</span>
          </span>
        ) : (
          <button onClick={() => setSeconds(28)} className="font-medium text-primary hover:underline">
            Resend code
          </button>
        )}
        <span className="text-border">·</span>
        <Link href="/login" className="font-medium text-muted-foreground hover:text-foreground">
          Go back
        </Link>
      </div>
    </AuthCard>
  );
}

export default function OtpPage() {
  return (
    <Suspense>
      <OtpContent />
    </Suspense>
  );
}
