import Link from 'next/link';
import type { ReactNode } from 'react';

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
    <main
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(10, 10, 15, 0.75)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Floating Pop-up Box Card */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#ffffff',
          borderRadius: '24px',
          padding: '36px 32px',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          animation: 'fadeInPop 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Close / Return to Home Button */}
        <Link
          href="/"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.05)',
            border: 'none',
            color: '#666666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 700,
            transition: 'all 0.15s ease',
          }}
          title="Close and return to store"
        >
          ✕
        </Link>

        {/* Brand Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #d4af37, #a07c2e)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '15px',
                  boxShadow: '0 4px 12px rgba(212,175,55,0.3)',
                }}
              >
                A
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '17px', fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>
                  AuraBeads
                </span>
                <span style={{ fontSize: '9px', color: '#888888', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginTop: '2px' }}>
                  Fashion Jewelry
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Title & Subtitle */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em', margin: 0 }}>
            {title}
          </h1>
          <p style={{ fontSize: '13px', color: '#666666', marginTop: '6px', lineHeight: 1.4 }}>
            {subtitle}
          </p>
        </div>

        {/* Form Body */}
        <div>{children}</div>

        {/* Footer Link */}
        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #f0ede6', textAlign: 'center', fontSize: '13px', color: '#666666' }}>
          {footerText}{' '}
          <Link
            href={footerHref}
            style={{
              fontWeight: 700,
              color: '#a07c2e',
              textDecoration: 'none',
              marginLeft: '4px',
            }}
          >
            {footerLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}
