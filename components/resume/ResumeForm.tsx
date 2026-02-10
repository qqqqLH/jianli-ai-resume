"use client";

import { FormEvent, useMemo, useState } from "react";
import { Save } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import type { ResumeInsert } from "@/types/resume";
import InputField from "@/components/resume/fields/InputField";
import TextareaField from "@/components/resume/fields/TextareaField";

type FormState = {
  fullName: string;
  email: string;
  summary: string;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  summary: "",
};

export default function ResumeForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isValid = useMemo(() => {
    return (
      form.fullName.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.summary.trim().length > 0
    );
  }, [form.email, form.fullName, form.summary]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid) {
      setErrorMsg("\u8bf7\u5148\u5b8c\u6574\u586b\u5199\u59d3\u540d\u3001\u90ae\u7bb1\u548c\u4e2a\u4eba\u603b\u7ed3\u3002");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const { client, error: clientError } = getSupabaseClient();
    if (!client) {
      setErrorMsg(clientError ?? "Supabase client is unavailable.");
      setLoading(false);
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      setErrorMsg(userError?.message ?? "You must be signed in to save a resume.");
      setLoading(false);
      return;
    }

    const payload: ResumeInsert = {
      user_id: user.id,
      full_name: form.fullName.trim(),
      email: form.email.trim(),
      summary: form.summary.trim(),
      experience: [],
      education: [],
    };

    const { error } = await client.from("resumes").insert(payload);

    if (error) {
      setErrorMsg(`Save failed: ${error.message}`);
      setLoading(false);
      return;
    }

    setSuccessMsg("\u7b80\u5386\u5df2\u4fdd\u5b58\u3002");
    setForm(initialState);
    setLoading(false);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <InputField
        id="fullName"
        label="\u59d3\u540d"
        value={form.fullName}
        placeholder="e.g. Alex Johnson"
        disabled={loading}
        onChange={(value) => setForm((prev) => ({ ...prev, fullName: value }))}
      />

      <InputField
        id="email"
        label="\u90ae\u7bb1"
        type="email"
        value={form.email}
        placeholder="you@example.com"
        disabled={loading}
        onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
      />

      <TextareaField
        id="summary"
        label="\u4e2a\u4eba\u603b\u7ed3"
        value={form.summary}
        placeholder="Briefly describe your strengths and career goals."
        disabled={loading}
        onChange={(value) => setForm((prev) => ({ ...prev, summary: value }))}
      />

      {errorMsg ? <p className="text-sm text-red-600">{errorMsg}</p> : null}
      {successMsg ? <p className="text-sm text-emerald-600">{successMsg}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Save className="h-4 w-4" />
        {loading ? "\u4fdd\u5b58\u4e2d..." : "\u4fdd\u5b58\u7b80\u5386"}
      </button>
    </form>
  );
}
