import Link from "next/link";
import { FileText, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-12">
      <section className="mx-auto grid w-full max-w-4xl gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:grid-cols-[1.2fr_1fr] md:p-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            <Sparkles className="h-3.5 w-3.5" />
            {"AI 简历助手"}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {"\u7528\u6a21\u5757\u5316\u6d41\u7a0b\u5feb\u901f\u751f\u6210\u7b80\u5386"}
          </h1>
          <p className="max-w-xl text-sm leading-6 text-slate-600 md:text-base">
            {
              "\u57fa\u4e8e Next.js 15\u3001Tailwind CSS\u3001Supabase \u4e0e Lucide React \u6784\u5efa\u3002\u4ece\u57fa\u672c\u4fe1\u606f\u5f00\u59cb\uff0c\u518d\u9010\u6b65\u6269\u5c55\u5de5\u4f5c\u7ecf\u5386\u548c\u6559\u80b2\u6a21\u5757\u3002"
            }
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <FileText className="h-4 w-4" />
              {"\u9a8c\u8bc1\u7801\u767b\u5f55"}
            </Link>
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
            >
              {"\u9a8c\u8bc1\u7801\u6ce8\u518c"}
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="text-sm font-semibold text-slate-900">{"\u5f53\u524d\u6280\u672f\u6808"}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>Next.js 15 (App Router)</li>
            <li>Tailwind CSS</li>
            <li>Supabase</li>
            <li>Lucide React（图标）</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
