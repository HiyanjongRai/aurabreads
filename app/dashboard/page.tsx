import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  ShoppingBag, Package, Clock, CheckCircle, Truck,
  Heart, MapPin, Star, ChevronRight, ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { logout } from '@/app/actions/auth';

const recentOrders = [
  { id: '#AB-4421', product: 'Gold Bead Bracelet',   price: 'NPR 1,850', status: 'delivered', date: '20 Jul 2026' },
  { id: '#AB-4398', product: 'Pearl Drop Earrings',  price: 'NPR 2,200', status: 'shipped',   date: '17 Jul 2026' },
  { id: '#AB-4371', product: 'Crystal Necklace Set', price: 'NPR 3,400', status: 'processing', date: '12 Jul 2026' },
];

const statusBadge = (status: string): React.CSSProperties => {
  const map: Record<string, { bg: string; color: string }> = {
    delivered:  { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80' },
    shipped:    { bg: 'rgba(99,102,241,0.15)',  color: '#818cf8' },
    processing: { bg: 'rgba(245,158,11,0.15)',  color: '#fbbf24' },
  };
  const s = map[status] ?? { bg: 'rgba(255,255,255,0.1)', color: '#fff' };
  return {
    background: s.bg,
    color: s.color,
    borderRadius: 99,
    padding: '3px 10px',
    fontSize: 11,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    textTransform: 'capitalize',
  };
};

const statusIcons: Record<string, React.ReactNode> = {
  delivered:  <CheckCircle size={11} />,
  shipped:    <Truck size={11} />,
  processing: <Clock size={11} />,
};

const cardStyle: React.CSSProperties = {
  background: '#16151f',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 20,
};

export default async function CustomerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  // Admins and sellers go to their dedicated portals
  if (user.role === 'ADMIN') redirect('/admin');
  if (user.role === 'SELLER') redirect('/seller');

  const firstName = user.name ? user.name.split(' ')[0] : 'Customer';
  const initial = user.name ? user.name[0].toUpperCase() : 'C';

  const quickStats = [
    { label: 'Total Orders',    value: '12', icon: ShoppingBag, color: '#d4af37', bg: 'rgba(212,175,55,0.15)' },
    { label: 'Wishlist Items',  value: '7',  icon: Heart,       color: '#f472b6', bg: 'rgba(236,72,153,0.15)' },
    { label: 'Saved Addresses', value: '2',  icon: MapPin,      color: '#818cf8', bg: 'rgba(99,102,241,0.15)' },
    { label: 'Reviews Given',   value: '5',  icon: Star,        color: '#4ade80', bg: 'rgba(34,197,94,0.15)'  },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Welcome Banner ───────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1c1829 0%, #241c10 100%)',
        border: '1px solid rgba(212,175,55,0.25)',
        borderRadius: 24,
        padding: '28px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: '#d4af37', textTransform: 'uppercase' }}>
            MY ACCOUNT
          </span>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '6px 0 4px 0' }}>
            Welcome back, {firstName}!
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            Here&apos;s an overview of your orders and saved activity.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #d4af37, #a07c2e)',
            color: '#000',
            fontSize: 20,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(212,175,55,0.3)',
          }}>
            {initial}
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', margin: 0 }}>{user.name}</p>
            <form action={logout} style={{ marginTop: 2 }}>
              <button type="submit" style={{ background: 'none', border: 'none', padding: 0, fontSize: 12, color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Quick Stats Grid ────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        {quickStats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={{ ...cardStyle, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {label}
              </span>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} />
              </div>
            </div>
            <p style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Orders + Actions Grid ───────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>

        {/* Recent Orders */}
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: 0 }}>Recent Orders</h2>
            <Link href="/dashboard/orders" style={{ fontSize: 12, fontWeight: 600, color: '#d4af37', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ArrowUpRight size={13} />
            </Link>
          </div>

          <div>
            {recentOrders.map((o, i) => (
              <div key={o.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: i < recentOrders.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.5)',
                  }}>
                    <Package size={18} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', margin: 0 }}>{o.product}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: '2px 0 0 0' }}>{o.id} · {o.date}</p>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', margin: 0 }}>{o.price}</p>
                  <div style={{ marginTop: 4 }}>
                    <span style={statusBadge(o.status)}>
                      {statusIcons[o.status]} {o.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={{
            padding: '18px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: 0 }}>Quick Actions</h2>
          </div>

          <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { label: 'Browse Store', href: '/',                   icon: ShoppingBag, desc: 'Explore new arrivals' },
              { label: 'My Wishlist',  href: '/dashboard/wishlist', icon: Heart,       desc: '7 saved items' },
              { label: 'Track Order',  href: '/dashboard/orders',   icon: Truck,       desc: 'Latest: #AB-4398' },
              { label: 'Profile Info', href: '/dashboard/profile',  icon: MapPin,      desc: 'Edit your details' },
            ].map(({ label, href, icon: Icon, desc }) => (
              <Link key={label} href={href} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 16px',
                borderRadius: 14,
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                transition: 'all 0.15s',
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(212,175,55,0.12)',
                  color: '#d4af37',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={17} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', margin: 0 }}>{label}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: '2px 0 0 0' }}>{desc}</p>
                </div>
                <ChevronRight size={15} color="rgba(255,255,255,0.25)" />
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* ── Account Summary Footer Card ─────────────────────────────────── */}
      <div style={{ ...cardStyle, padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: 0 }}>Account Information</h2>
          <Link href="/dashboard/profile" style={{ fontSize: 12, fontWeight: 600, color: '#d4af37', textDecoration: 'none' }}>
            Edit Profile →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 4 }}>Full Name</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', margin: 0 }}>{user.name}</p>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 4 }}>Email</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', margin: 0 }}>{user.email}</p>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 4 }}>Account Type</p>
            <span style={{
              display: 'inline-block',
              background: 'rgba(212,175,55,0.15)',
              color: '#d4af37',
              border: '1px solid rgba(212,175,55,0.25)',
              borderRadius: 99,
              padding: '3px 12px',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}>
              {user.role}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
