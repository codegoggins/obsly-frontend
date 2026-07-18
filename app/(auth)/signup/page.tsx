"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { User, Building2, Globe, Mail, Lock, ArrowRight } from "lucide-react";
import { setToken } from "@/lib/auth";
import { signupSchema } from "@/lib/validations/auth";
import { COUNTRIES } from "@/lib/countries";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import { PasswordStrength } from "@/components/ui/password-strength";
import { OrDivider } from "@/components/ui/or-divider";
import { SubmitButton } from "@/components/ui/submit-button";
import { AuthCard } from "@/components/auth/auth-card";
import { SocialAuth } from "@/components/auth/social-auth";

type FieldErrors = {
  name?: string;
  company?: string;
  country?: string;
  email?: string;
  password?: string;
  agree?: string;
};

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);

  const submit = () => {
    const result = signupSchema.safeParse({ name, company, country, email, password, agree });
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      setErrors({
        name: fieldErrors.name?.[0],
        company: fieldErrors.company?.[0],
        country: fieldErrors.country?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        agree: fieldErrors.agree?.[0],
      });
      return;
    }
    setErrors({});
    setBusy(true);
    setToken();
    setTimeout(() => router.push("/"), 700);
  };

  return (
    <AuthCard
      eyebrow="Get started free"
      title="Create your account"
      sub="Start catching errors in minutes. No credit card required."
    >
      <SocialAuth />
      <OrDivider label="or sign up with email" />
      <div className="space-y-3.5">
        <InputField
          label="Full name"
          icon={User}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          error={errors.name}
          placeholder="Mara Reyes"
        />
        <InputField
          label="Company name"
          icon={Building2}
          value={company}
          onChange={(e) => {
            setCompany(e.target.value);
            setErrors((prev) => ({ ...prev, company: undefined }));
          }}
          error={errors.company}
          placeholder="Acme Inc"
        />
        <SelectField
          label="Country"
          icon={Globe}
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            setErrors((prev) => ({ ...prev, country: undefined }));
          }}
          error={errors.country}
          placeholder="Select your country"
          options={COUNTRIES}
        />
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
            placeholder="8+ characters"
          />
          <PasswordStrength value={password} />
        </div>
        <div>
          <label className="flex cursor-pointer items-start gap-2.5 text-[0.78125rem] text-muted-foreground">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => {
                setAgree(e.target.checked);
                setErrors((prev) => ({ ...prev, agree: undefined }));
              }}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-border bg-card accent-primary"
            />
            <span>
              I agree to the <span className="text-foreground/80">Terms of Service</span> and{" "}
              <span className="text-foreground/80">Privacy Policy</span>.
            </span>
          </label>
          {errors.agree && <div className="mt-1.5 text-[0.71875rem] text-danger">{errors.agree}</div>}
        </div>
        <SubmitButton onClick={submit} busy={busy}>
          Create account <ArrowRight size={15} />
        </SubmitButton>
      </div>
      <p className="text-center text-[0.8125rem] text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
