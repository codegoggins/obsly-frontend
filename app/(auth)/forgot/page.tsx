"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Mail, Send, ArrowLeft } from "lucide-react";
import { forgotSchema } from "@/lib/validations/auth";
import { InputField } from "@/components/ui/input-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { AuthCard } from "@/components/auth/auth-card";

export default function ForgotPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  const submit = () => {
    const result = forgotSchema.safeParse({ email });
    if (!result.success) {
      setError(z.flattenError(result.error).fieldErrors.email?.[0]);
      return;
    }
    setError(undefined);
    setBusy(true);
    setTimeout(
      () => router.push(`/otp?reason=forgot&next=reset&email=${encodeURIComponent(email)}`),
      600,
    );
  };

  return (
    <AuthCard
      eyebrow="Account recovery"
      title="Forgot your password?"
      sub="Enter your email and we'll send a 6-digit code to reset it."
    >
      <div className="space-y-3.5">
        <InputField
          label="Work email"
          type="email"
          icon={Mail}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(undefined);
          }}
          error={error}
          placeholder="you@company.com"
          autoFocus
        />
        <SubmitButton onClick={submit} busy={busy}>
          Send reset code <Send size={14} />
        </SubmitButton>
      </div>
      <Link
        href="/login"
        className="mx-auto flex w-fit items-center gap-1.5 text-[0.8125rem] font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={14} /> Back to sign in
      </Link>
    </AuthCard>
  );
}
