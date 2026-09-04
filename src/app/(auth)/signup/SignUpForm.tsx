"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signUp } from "@/app/actions/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { InputField } from "@/components/auth/InputField";
import { SubmitButton } from "@/components/auth/SubmitButton";

export default function SignUpForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await signUp(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <AuthCard
      title="Create an account"
      description="Enter your details to get started."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <InputField
          id="email"
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
        <InputField
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
          minLength={8}
        />
        <InputField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
        />

        {error && (
          <p className="rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 px-3.5 py-2.5 text-sm text-[var(--destructive)]">
            {error}
          </p>
        )}

        <SubmitButton pending={isPending}>Create account</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[var(--accent)] underline-offset-2 hover:underline"
        >
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
