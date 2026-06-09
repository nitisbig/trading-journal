"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { AuthState } from "@/app/(auth)/actions";

interface AuthFormProps {
  mode: "signIn" | "signUp";
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
}

const COPY = {
  signIn: {
    title: "Welcome back",
    subtitle: "Sign in to your trading journal",
    submit: "Sign in",
    altText: "Need an account?",
    altHref: "/register",
    altLabel: "Create one",
  },
  signUp: {
    title: "Create your account",
    subtitle: "Start logging your trades",
    submit: "Create account",
    altText: "Already have an account?",
    altHref: "/login",
    altLabel: "Sign in",
  },
} as const;

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    {},
  );
  const copy = COPY[mode];

  return (
    <div className="w-full max-w-sm rounded-card border border-border bg-surface p-6 shadow-sm sm:p-8">
      <h1 className="text-xl font-bold text-ink">{copy.title}</h1>
      <p className="mt-1 text-sm text-ink-muted">{copy.subtitle}</p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Email
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="rounded-md border border-border bg-app px-3 py-2 text-sm text-ink outline-none focus:border-brand"
            placeholder="you@example.com"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Password
          </span>
          <input
            type="password"
            name="password"
            required
            autoComplete={mode === "signIn" ? "current-password" : "new-password"}
            className="rounded-md border border-border bg-app px-3 py-2 text-sm text-ink outline-none focus:border-brand"
            placeholder="••••••••"
          />
        </label>

        {state.error && (
          <p className="rounded-md bg-loss-soft px-3 py-2 text-sm text-loss">
            {state.error}
          </p>
        )}
        {state.message && (
          <p className="rounded-md bg-profit-soft px-3 py-2 text-sm text-profit">
            {state.message}
          </p>
        )}

        <Button type="submit" disabled={pending} className="mt-2 w-full">
          {pending ? "Please wait…" : copy.submit}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        {copy.altText}{" "}
        <Link href={copy.altHref} className="font-medium text-brand hover:underline">
          {copy.altLabel}
        </Link>
      </p>
    </div>
  );
}
