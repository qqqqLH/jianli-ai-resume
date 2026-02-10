"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import EmailOtpAuthCard from "@/components/auth/EmailOtpAuthCard";

function SignUpPageContent() {
  const searchParams = useSearchParams();
  const nextPath = useMemo(() => searchParams.get("next") ?? "/resume/new", [searchParams]);

  return <EmailOtpAuthCard mode="sign_up" nextPath={nextPath} />;
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-50 px-4 py-12" />}>
      <SignUpPageContent />
    </Suspense>
  );
}
