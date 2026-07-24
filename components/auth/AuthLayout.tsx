import Link from 'next/link';
import type { ReactNode } from 'react';
import { Logo } from '../Logo';

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
    <main className="relative min-h-screen overflow-hidden bg-white font-inter text-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-black/5 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center">
          <section className="grid w-full gap-0 overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-[1.1fr_0.9fr] lg:grid-cols-[1.2fr_0.8fr]">
            {/* Left Panel - Desktop Only - Enhanced Gradient */}
            <div className="hidden flex-col justify-between bg-gradient-to-br from-gray-950 via-black to-gray-900 p-12 text-white md:flex relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10 space-y-12">
                <div className="space-y-2">
                  <div className="text-gold-400">
                    <Logo className="text-gold-400" />
                  </div>
                </div>
                <div className="space-y-6">
                  <h1 className="text-5xl font-light leading-tight tracking-tight font-serif">
                    Timeless Elegance Awaits
                  </h1>
                  <p className="max-w-sm leading-relaxed text-gray-300 text-base">
                    Join AuraBeads and discover a curated collection of premium jewelry that celebrates your unique style and sophistication.
                  </p>
                </div>
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex gap-2">
                  <div className="h-1 w-12 rounded-full bg-gold-500" />
                  <div className="h-1 w-8 rounded-full bg-gold-500 opacity-50" />
                  <div className="h-1 w-4 rounded-full bg-gold-500 opacity-25" />
                </div>
                <p className="text-sm text-gray-400">
                  Secure • Elegant • Luxurious
                </p>
              </div>
            </div>

            {/* Right Panel - Form Area - Enhanced */}
            <div className="flex flex-col px-6 py-12 sm:px-10 md:px-12 lg:px-14 backdrop-blur-sm">
              <div className="mx-auto w-full max-w-md flex-1 flex flex-col justify-center">
                {/* Mobile Logo */}
                <div className="mb-8 md:hidden">
                  <div className="inline-flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-white text-sm font-bold">
                      A
                    </div>
                    <span className="text-xl font-bold tracking-tight">AuraBeads</span>
                  </div>
                </div>

                {/* Form Header - Enhanced */}
                <div className="mb-10 space-y-2">
                  <h2 className="text-4xl font-light tracking-tight font-serif text-gray-950 leading-tight">
                    {title}
                  </h2>
                  <p className="text-base leading-7 text-gray-600 font-light">
                    {subtitle}
                  </p>
                </div>

                {/* Form Content */}
                <div className="space-y-1">
                  {children}
                </div>

                {/* Footer - Enhanced */}
                <div className="mt-8 text-center text-sm text-gray-600">
                  {footerText}{' '}
                  <Link
                    href={footerHref}
                    className="font-semibold text-gold-600 transition-all duration-300 hover:text-gold-700 hover:underline hover:decoration-gold-600 hover:decoration-2 hover:underline-offset-2"
                  >
                    {footerLabel}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
