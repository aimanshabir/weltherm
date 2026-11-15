import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import LoginForm from "@/components/admin/login-form";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false },
};

export default function AdminLoginPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-ink-950 px-4"
      style={{
        backgroundImage:
          "radial-gradient(50rem 30rem at 80% -10%, rgba(217,38,52,0.25), transparent 60%)",
      }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <Image src="/uploads/brand/logo.png" alt="Weltherm" width={280} height={84} className="h-14 w-auto" />
          <p className="mt-3 text-xs font-bold uppercase tracking-widest text-ink-500">Admin Panel</p>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <h1 className="text-xl font-extrabold text-ink-900">Sign in</h1>
          <p className="mt-1 mb-6 text-sm text-ink-500">Enter your credentials to manage the site.</p>
          <Suspense fallback={null}>
            <LoginGate />
          </Suspense>
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-xs text-ink-500">
          <Link href="/" className="hover:text-white">
            ← Back to weltherm.com
          </Link>
        </p>
      </div>
    </div>
  );
}

async function LoginGate() {
  const user = await getSessionUser();
  if (user) redirect("/admin");
  return null;
}
