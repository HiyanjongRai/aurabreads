import Link from "next/link";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  footerText: string;
  footerHref: string;
  footerLabel: string;
  children: ReactNode;
};

export function AuthLayout({
  title,
  subtitle,
  footerText,
  footerHref,
  footerLabel,
  children,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#eef2ff,transparent_30%),linear-gradient(135deg,#f8fafc,#f1f5f9_45%,#ecfeff)] px-4 py-8 text-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-[8px] border border-white/70 bg-white shadow-2xl shadow-slate-200/80 md:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden bg-slate-950 p-10 text-white md:flex md:flex-col md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
                AuraBeads
              </p>
              <h1 className="mt-8 text-4xl font-semibold leading-tight">
                Secure access for a calm, polished storefront.
              </h1>
            </div>
            <div className="space-y-4 text-sm leading-6 text-slate-300">
              <p>
                Passwords are hashed, sessions are stored in HTTP-only cookies,
                and every mutation is validated on the server.
              </p>
              <div className="h-1 w-20 rounded-full bg-cyan-300" />
            </div>
          </div>
          <div className="px-5 py-8 sm:px-10 md:px-12">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-700 md:hidden">
                  AuraBeads
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {subtitle}
                </p>
              </div>
              {children}
              <p className="mt-8 text-center text-sm text-slate-600">
                {footerText}{" "}
                <Link
                  href={footerHref}
                  className="font-semibold text-cyan-700 transition hover:text-cyan-900"
                >
                  {footerLabel}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
