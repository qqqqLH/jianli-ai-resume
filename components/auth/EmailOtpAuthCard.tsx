"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

type AuthMode = "sign_in" | "sign_up";

type EmailOtpAuthCardProps = {
  mode: AuthMode;
  nextPath: string;
};

export default function EmailOtpAuthCard({ mode, nextPath }: EmailOtpAuthCardProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"request" | "verify">("request");
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  const requestCode = async () => {
    setLoading(true);
    setErrorMsg(null);
    setInfoMsg(null);

    const { client, error: clientError } = getSupabaseClient();
    if (!client) {
      setErrorMsg(clientError ?? "Supabase client is unavailable.");
      setLoading(false);
      return;
    }

    const { error } = await client.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    setStep("verify");
    setCooldown(60);
    setInfoMsg("Verification code sent. Check your inbox.");
    setLoading(false);
  };

  const verifyCode = async () => {
    setLoading(true);
    setErrorMsg(null);
    setInfoMsg(null);

    const { client, error: clientError } = getSupabaseClient();
    if (!client) {
      setErrorMsg(clientError ?? "Supabase client is unavailable.");
      setLoading(false);
      return;
    }

    const { error } = await client.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: "email",
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    router.replace(nextPath);
    router.refresh();
  };

  const onRequestSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await requestCode();
  };

  const onVerifySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await verifyCode();
  };

  const isSignIn = mode === "sign_in";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          {isSignIn ? "Email Code Sign In" : "Email Code Register"}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {isSignIn
            ? "Enter your email, then sign in with a one-time code."
            : "Enter your email. If this is your first time, the account will be created automatically."}
        </p>

        {step === "request" ? (
          <form onSubmit={onRequestSubmit} className="mt-6 space-y-4">
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

            {errorMsg ? <p className="text-sm text-red-600">{errorMsg}</p> : null}
            {infoMsg ? <p className="text-sm text-emerald-600">{infoMsg}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={onVerifySubmit} className="mt-6 space-y-4">
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
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="code" className="block text-sm font-medium text-slate-700">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                placeholder="6-digit code"
                disabled={loading}
                required
              />
            </div>

            {errorMsg ? <p className="text-sm text-red-600">{errorMsg}</p> : null}
            {infoMsg ? <p className="text-sm text-emerald-600">{infoMsg}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Verifying..." : "Verify and Continue"}
            </button>

            <button
              type="button"
              onClick={requestCode}
              disabled={loading || cooldown > 0}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("request");
                setCode("");
                setErrorMsg(null);
                setInfoMsg(null);
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Use Another Email
            </button>
          </form>
        )}

        <p className="mt-4 text-sm text-slate-600">
          {isSignIn ? "Need a new account?" : "Already have an account?"}{" "}
          <Link
            href={`${isSignIn ? "/auth/sign-up" : "/auth/sign-in"}?next=${encodeURIComponent(nextPath)}`}
            className="text-slate-900 underline"
          >
            {isSignIn ? "Go to register" : "Go to sign in"}
          </Link>
        </p>
      </section>
    </main>
  );
}
