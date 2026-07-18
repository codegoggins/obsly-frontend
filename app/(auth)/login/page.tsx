"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { setToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";
import { InputField } from "@/components/ui/input-field";
import { PasswordStrength } from "@/components/ui/password-strength";
import { OrDivider } from "@/components/ui/or-divider";
import { SubmitButton } from "@/components/ui/submit-button";
import { AuthCard } from "@/components/auth/auth-card";
import { SocialAuth } from "@/components/auth/social-auth";

type FieldErrors = { email?: string; password?: string };

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);

  const submit = () => {
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      setErrors({ email: fieldErrors.email?.[0], password: fieldErrors.password?.[0] });
      return;
    }
    setErrors({});
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
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          error={errors.email}
          placeholder="you@company.com"
        />
        <div>
          <InputField
            label="Password"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={errors.password}
            placeholder="••••••••"
            right={
              <Link href="/forgot" className="text-xs font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            }
          />
          <PasswordStrength value={password} />
        </div>
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
