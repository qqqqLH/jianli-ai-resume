"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";
import TurnstileCaptcha from "@/components/auth/TurnstileCaptcha";

type AuthMode = "sign_in" | "sign_up";

type EmailOtpAuthCardProps = {
  mode: AuthMode;
  nextPath: string;
};

function toChineseAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "\u90ae\u7bb1\u6216\u9a8c\u8bc1\u7801\u9519\u8bef\u3002";
  }
  if (normalized.includes("token has expired") || normalized.includes("otp expired")) {
    return "\u9a8c\u8bc1\u7801\u5df2\u8fc7\u671f\uff0c\u8bf7\u91cd\u65b0\u83b7\u53d6\u3002";
  }
  if (normalized.includes("otp") && normalized.includes("invalid")) {
    return "\u9a8c\u8bc1\u7801\u65e0\u6548\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\u3002";
  }
  if (normalized.includes("security purposes") || normalized.includes("too many requests")) {
    return "\u64cd\u4f5c\u592a\u9891\u7e41\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002";
  }
  if (normalized.includes("email address not authorized")) {
    return "\u5f53\u524d\u9879\u76ee\u90ae\u4ef6\u670d\u52a1\u672a\u6388\u6743\u8be5\u90ae\u7bb1\uff0c\u8bf7\u914d\u7f6e\u81ea\u5b9a\u4e49 SMTP\u3002";
  }
  if (normalized.includes("user not found")) {
    return "\u8be5\u90ae\u7bb1\u672a\u6ce8\u518c\uff0c\u8bf7\u5148\u6ce8\u518c\u3002";
  }

  return `\u64cd\u4f5c\u5931\u8d25\uff1a${message}`;
}

export default function EmailOtpAuthCard({ mode, nextPath }: EmailOtpAuthCardProps) {
  const router = useRouter();
  const captchaEnabled = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"request" | "verify">("request");
  const [cooldown, setCooldown] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaRefreshKey, setCaptchaRefreshKey] = useState(0);
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
      setErrorMsg(clientError ?? "系统暂时不可用，请稍后再试。");
      setLoading(false);
      return;
    }

    if (captchaEnabled && !captchaToken) {
      setErrorMsg("请先完成人机验证。");
      setLoading(false);
      return;
    }

    const { error } = await client.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: mode === "sign_up",
        captchaToken: captchaToken ?? undefined,
      },
    });

    if (error) {
      setErrorMsg(toChineseAuthError(error.message));
      setLoading(false);
      return;
    }

    setStep("verify");
    setCooldown(60);
    setCaptchaToken(null);
    setCaptchaRefreshKey((prev) => prev + 1);
    setInfoMsg("\u9a8c\u8bc1\u7801\u5df2\u53d1\u9001\uff0c\u8bf7\u67e5\u6536\u90ae\u7bb1\u3002");
    setLoading(false);
  };

  const verifyCode = async () => {
    setLoading(true);
    setErrorMsg(null);
    setInfoMsg(null);

    const { client, error: clientError } = getSupabaseClient();
    if (!client) {
      setErrorMsg(clientError ?? "系统暂时不可用，请稍后再试。");
      setLoading(false);
      return;
    }

    const { error } = await client.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: "email",
      options: {
        captchaToken: captchaToken ?? undefined,
      },
    });

    if (error) {
      setErrorMsg(toChineseAuthError(error.message));
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

  const onResend = async () => {
    if (captchaEnabled) {
      setStep("request");
      setCaptchaToken(null);
      setCaptchaRefreshKey((prev) => prev + 1);
      setInfoMsg("请重新完成人机验证后，再发送验证码。");
      return;
    }
    await requestCode();
  };

  const isSignIn = mode === "sign_in";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          {isSignIn
            ? "\u90ae\u7bb1\u9a8c\u8bc1\u7801\u767b\u5f55"
            : "\u90ae\u7bb1\u9a8c\u8bc1\u7801\u6ce8\u518c"}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {isSignIn
            ? "\u8f93\u5165\u90ae\u7bb1\uff0c\u6211\u4eec\u4f1a\u53d1\u90016\u4f4d\u9a8c\u8bc1\u7801\u7528\u4e8e\u767b\u5f55\u3002"
            : "\u8f93\u5165\u90ae\u7bb1\uff0c\u6211\u4eec\u4f1a\u53d1\u90016\u4f4d\u9a8c\u8bc1\u7801\uff0c\u9a8c\u8bc1\u540e\u81ea\u52a8\u521b\u5efa\u8d26\u53f7\u3002"}
        </p>

        {step === "request" ? (
          <form onSubmit={onRequestSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                {"\u90ae\u7bb1"}
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

            <TurnstileCaptcha
              refreshKey={captchaRefreshKey}
              onTokenChange={(token) => {
                setCaptchaToken(token);
              }}
            />

            {errorMsg ? <p className="text-sm text-red-600">{errorMsg}</p> : null}
            {infoMsg ? <p className="text-sm text-emerald-600">{infoMsg}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "\u53d1\u9001\u4e2d..." : "\u53d1\u9001\u9a8c\u8bc1\u7801"}
            </button>
          </form>
        ) : (
          <form onSubmit={onVerifySubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                {"\u90ae\u7bb1"}
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
                {"\u9a8c\u8bc1\u7801"}
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                placeholder="6\u4f4d\u9a8c\u8bc1\u7801"
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
              {loading ? "\u9a8c\u8bc1\u4e2d..." : "\u9a8c\u8bc1\u5e76\u8fdb\u5165"}
            </button>

            <button
              type="button"
              onClick={onResend}
              disabled={loading || cooldown > 0}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {cooldown > 0
                ? `${cooldown}\u79d2\u540e\u53ef\u91cd\u53d1`
                : "\u91cd\u65b0\u53d1\u9001\u9a8c\u8bc1\u7801"}
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
              {"\u66f4\u6362\u90ae\u7bb1"}
            </button>
          </form>
        )}

        <p className="mt-4 text-sm text-slate-600">
          {isSignIn
            ? "\u8fd8\u6ca1\u6709\u8d26\u53f7\uff1f"
            : "\u5df2\u7ecf\u6709\u8d26\u53f7\uff1f"}{" "}
          <Link
            href={`${isSignIn ? "/auth/sign-up" : "/auth/sign-in"}?next=${encodeURIComponent(nextPath)}`}
            className="text-slate-900 underline"
          >
            {isSignIn ? "\u53bb\u6ce8\u518c" : "\u53bb\u767b\u5f55"}
          </Link>
        </p>
      </section>
    </main>
  );
}
