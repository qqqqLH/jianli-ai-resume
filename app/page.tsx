import Link from "next/link";
import { FileText, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-12">
      <section className="mx-auto grid w-full max-w-4xl gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:grid-cols-[1.2fr_1fr] md:p-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            <Sparkles className="h-3.5 w-3.5" />
            AI Resume Assistant
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Create your resume with a modular workflow
          </h1>
          <p className="max-w-xl text-sm leading-6 text-slate-600 md:text-base">
            Built with Next.js 15, Tailwind CSS, Supabase, and Lucide React. Start with basic
            profile fields, then expand to experience and education modules.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <FileText className="h-4 w-4" />
              Email Code Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
            >
              Email Code Register
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-sm font-semibold text-slate-900">Current Stack</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>Next.js 15 (App Router)</li>
            <li>Tailwind CSS</li>
            <li>Supabase</li>
            <li>Lucide React</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
