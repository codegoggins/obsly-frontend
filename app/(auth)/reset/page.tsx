"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Lock, KeyRound, Check } from "lucide-react";
import { resetSchema } from "@/lib/validations/auth";
import { InputField } from "@/components/ui/input-field";
import { PasswordStrength } from "@/components/ui/password-strength";
import { SubmitButton } from "@/components/ui/submit-button";
import { AuthCard } from "@/components/auth/auth-card";

type FieldErrors = { password?: string; confirm?: string };

export default function ResetPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);

  const submit = () => {
    const result = resetSchema.safeParse({ password, confirm });
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      setErrors({ password: fieldErrors.password?.[0], confirm: fieldErrors.confirm?.[0] });
      return;
    }
    setErrors({});
    setBusy(true);
    setTimeout(() => router.push("/login"), 700);
  };

  return (
    <AuthCard
      eyebrow="Almost done"
      title="Set a new password"
      sub="Choose a strong password you haven't used before."
    >
      <div className="space-y-3.5">
        <div>
          <InputField
            label="New password"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={errors.password}
            placeholder="8+ characters"
            autoFocus
          />
          <PasswordStrength value={password} />
        </div>
        <InputField
          label="Confirm password"
          type="password"
          icon={KeyRound}
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            setErrors((prev) => ({ ...prev, confirm: undefined }));
          }}
          error={errors.confirm}
          placeholder="Re-enter password"
        />
        <SubmitButton onClick={submit} busy={busy}>
          Reset password <Check size={15} />
        </SubmitButton>
      </div>
    </AuthCard>
  );
}
