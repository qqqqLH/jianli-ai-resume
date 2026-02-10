import ResumeForm from "@/components/resume/ResumeForm";

export default function NewResumePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <section className="mx-auto w-full max-w-2xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {"\u65b0\u5efa\u7b80\u5386"}
          </h1>
          <p className="text-sm text-slate-600">
            {
              "\u5148\u5f55\u5165\u57fa\u7840\u4fe1\u606f\uff0c\u540e\u7eed\u53ef\u4ee5\u7ee7\u7eed\u6269\u5c55\u5de5\u4f5c\u7ecf\u5386\u4e0e\u6559\u80b2\u80cc\u666f\u3002"
            }
          </p>
        </header>

        <ResumeForm />
      </section>
    </main>
  );
}
