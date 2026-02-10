"use client";

import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

type SessionState = {
  userEmail: string | null;
  userId: string | null;
};

export default function UserSessionCard() {
  const router = useRouter();
  const [sessionState, setSessionState] = useState<SessionState>({
    userEmail: null,
    userId: null,
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      const { client, error } = getSupabaseClient();
      if (!client) {
        if (active) setErrorMsg(error ?? "Supabase client is unavailable.");
        return;
      }

      const {
        data: { user },
      } = await client.auth.getUser();

      if (!active) {
        return;
      }

      setSessionState({
        userEmail: user?.email ?? null,
        userId: user?.id ?? null,
      });
    };

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  const handleSignOut = async () => {
    setLoading(true);
    setErrorMsg(null);

    const { client, error } = getSupabaseClient();
    if (!client) {
      setErrorMsg(error ?? "Supabase client is unavailable.");
      setLoading(false);
      return;
    }

    const { error: signOutError } = await client.auth.signOut();

    if (signOutError) {
      setErrorMsg(signOutError.message);
      setLoading(false);
      return;
    }

    router.replace("/auth/sign-in");
    router.refresh();
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-500">Logged in user</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{sessionState.userEmail ?? "-"}</p>
      <p className="mt-1 break-all font-mono text-xs text-slate-600">{sessionState.userId ?? "-"}</p>

      {errorMsg ? <p className="mt-2 text-xs text-red-600">{errorMsg}</p> : null}

      <button
        type="button"
        onClick={handleSignOut}
        disabled={loading}
        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <LogOut className="h-3.5 w-3.5" />
        {loading ? "Signing out..." : "Sign Out"}
      </button>
    </div>
  );
}
