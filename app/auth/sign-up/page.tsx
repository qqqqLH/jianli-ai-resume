"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

function SignUpPageContent() {
  const searchParams = useSearchParams();
  const nextPath = useMemo(() => searchParams.get("next") ?? "/resume/new", [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { client, error: clientError } = getSupabaseClient();
    if (!client) {
      setErrorMsg(clientError ?? "Supabase client is unavailable.");
      setLoading(false);
      return;
    }

    const emailRedirectTo = `${window.location.origin}/auth/sign-in?next=${encodeURIComponent(nextPath)}`;
    const { error } = await client.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    setSuccessMsg("Sign-up succeeded. Please confirm your email, then sign in.");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Create Account</h1>
        <p className="mt-1 text-sm text-slate-600">Email confirmation is enabled.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
              placeholder="you@example.com"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
              placeholder="At least 6 characters"
              disabled={loading}
              minLength={6}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
              placeholder="Re-enter password"
              disabled={loading}
              minLength={6}
              required
            />
          </div>

          {errorMsg ? <p className="text-sm text-red-600">{errorMsg}</p> : null}
          {successMsg ? <p className="text-sm text-emerald-600">{successMsg}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Already registered?{" "}
          <Link href={`/auth/sign-in?next=${encodeURIComponent(nextPath)}`} className="text-slate-900 underline">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-50 px-4 py-12" />}>
      <SignUpPageContent />
    </Suspense>
  );
}
