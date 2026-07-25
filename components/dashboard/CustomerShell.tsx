'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ShoppingBag, Heart, MapPin, CreditCard,
  Bell, Settings, Sparkles, LogOut, Menu, X, ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { logout } from '@/app/actions/auth';

const navItems = [
  { href: '/dashboard',               label: 'Overview',         icon: LayoutDashboard },
  { href: '/dashboard/orders',        label: 'My Orders',        icon: ShoppingBag     },
  { href: '/dashboard/wishlist',      label: 'Wishlist',         icon: Heart           },
  { href: '/dashboard/addresses',     label: 'Addresses',        icon: MapPin          },
  { href: '/dashboard/payments',      label: 'Payments',         icon: CreditCard      },
  { href: '/dashboard/notifications', label: 'Notifications',    icon: Bell            },
  { href: '/dashboard/profile',       label: 'Profile',          icon: Settings        },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* ── Global customer shell styles ── */}
      <style>{`
        .customer-shell {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0e13 0%, #1a1625 100%);
          font-family: Inter, sans-serif;
        }
        .customer-topbar {
          position: sticky;
          top: 0;
          z-index: 30;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: rgba(15,14,19,0.96);
          backdrop-filter: blur(14px);
        }
        .customer-body {
          display: flex;
          min-height: calc(100vh - 60px);
        }
        .customer-sidenav {
          width: 220px;
          flex-shrink: 0;
          border-right: 1px solid rgba(255,255,255,0.07);
          padding: 20px 12px;
          background: rgba(0,0,0,0.2);
        }
        .customer-content {
          flex: 1;
          padding: 32px 28px;
          max-width: 1100px;
        }
        .cnav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 14px;
          border-radius: 12px;
          margin-bottom: 3px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.45);
          transition: all 0.15s;
        }
        .cnav-item:hover {
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.05);
        }
        .cnav-item.active {
          color: #d4af37;
          background: rgba(212,175,55,0.12);
          font-weight: 700;
        }
        /* Mobile drawer */
        .customer-drawer-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 40;
          background: rgba(0,0,0,0.7);
        }
        .customer-drawer-backdrop.open { display: block; }
        .customer-drawer {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 50;
          width: 260px;
          background: #0f0e13;
          border-right: 1px solid rgba(255,255,255,0.07);
          padding: 20px 12px;
          transform: translateX(-100%);
          transition: transform 0.28s ease;
          display: flex;
          flex-direction: column;
        }
        .customer-drawer.open { transform: translateX(0); }
        .mob-menu-btn { display: none; }
        @media (max-width: 900px) {
          .customer-sidenav { display: none; }
          .mob-menu-btn { display: flex; }
          .customer-content { padding: 20px 16px; }
        }
      `}</style>

      <div className="customer-shell">

        {/* ── Topbar ─────────────────────────────────────────────────────── */}
        <header className="customer-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Mobile hamburger */}
            <button
              className="mob-menu-btn"
              onClick={() => setDrawerOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex', padding: 4 }}
            >
              <Menu size={20} />
            </button>

            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#d4af37,#a07c2e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={15} color="#000" />
              </div>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 600, letterSpacing: '0.12em', color: '#fff', textTransform: 'uppercase' }}>
                Aurabeads
              </span>
            </Link>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
              Shop
            </Link>
            <div style={{ width: 34, height: 34, borderRadius: 99, background: 'linear-gradient(135deg,#d4af37,#a07c2e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#000', cursor: 'pointer' }}>
              C
            </div>
          </div>
        </header>

        {/* ── Body (sidenav + content) ──────────────────────────────────── */}
        <div className="customer-body">

          {/* Desktop Side Nav */}
          <nav className="customer-sidenav">
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', padding: '0 14px', marginBottom: 12 }}>
              MY ACCOUNT
            </p>
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} className={`cnav-item ${active ? 'active' : ''}`}>
                  <Icon size={15} />
                  {label}
                  {active && <ChevronRight size={12} style={{ marginLeft: 'auto' }} />}
                </Link>
              );
            })}

            {/* Logout */}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <form action={logout}>
                <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 14px', borderRadius: 12, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.3)', fontSize: 13, cursor: 'pointer' }}>
                  <LogOut size={15} />
                  Sign Out
                </button>
              </form>
            </div>
          </nav>

          {/* Page Content */}
          <main className="customer-content">{children}</main>
        </div>

        {/* ── Mobile Drawer ─────────────────────────────────────────────── */}
        <div className={`customer-drawer-backdrop ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)} />
        <div className={`customer-drawer ${drawerOpen ? 'open' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>My Account</span>
            <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex' }}>
              <X size={18} />
            </button>
          </div>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={`cnav-item ${active ? 'active' : ''}`} onClick={() => setDrawerOpen(false)}>
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
          <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <form action={logout}>
              <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 14px', borderRadius: 12, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.3)', fontSize: 13, cursor: 'pointer' }}>
                <LogOut size={15} />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
