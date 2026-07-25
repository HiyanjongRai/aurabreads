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
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f9f8f6 0%, #f1eee7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
      }}
    >
      {/* Soft Ambient Background Glows */}
      <div
        style={{
          position: 'fixed',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Centered White Pop-up Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '480px',
          background: '#ffffff',
          borderRadius: '28px',
          padding: '40px 36px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Brand Logo Header */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #d4af37, #a07c2e)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '16px',
                  boxShadow: '0 4px 14px rgba(212,175,55,0.3)',
                }}
              >
                A
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>
                  AuraBeads
                </span>
                <span style={{ fontSize: '10px', color: '#888888', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginTop: '2px' }}>
                  Fashion Jewelry
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Title & Subtitle */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em', margin: 0 }}>
            {title}
          </h1>
          <p style={{ fontSize: '13px', color: '#666666', marginTop: '6px', lineHeight: 1.5 }}>
            {subtitle}
          </p>
        </div>

        {/* Form Body */}
        <div>{children}</div>

        {/* Card Footer Link */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #f0ede6', textAlign: 'center', fontSize: '13px', color: '#666666' }}>
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
