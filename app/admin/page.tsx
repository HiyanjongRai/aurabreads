import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  Users, ShoppingBag, Package, CreditCard,
  TrendingUp, TrendingDown, CheckCircle, Clock,
  Store, Activity, ArrowUpRight, AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { getDb } from '@/lib/db';

/* ── Styles ────────────────────────────────────────────────────────────────── */
const card: React.CSSProperties = {
  background: '#161622',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 20,
  padding: '20px 24px',
};

const sectionCard: React.CSSProperties = {
  background: '#161622',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 20,
  overflow: 'hidden',
};

const divider: React.CSSProperties = {
  borderBottom: '1px solid rgba(255,255,255,0.06)',
};

const labelText: React.CSSProperties = { fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' };
const mutedText: React.CSSProperties = { fontSize: 12, color: 'rgba(255,255,255,0.35)' };
const boldText: React.CSSProperties = { fontSize: 14, fontWeight: 600, color: '#fff' };

const statusPill = (status: string): React.CSSProperties => {
  const map: Record<string, { bg: string; color: string }> = {
    delivered: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
    pending: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
    processing: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8' },
    cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
    active: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
    inactive: { bg: 'rgba(255,255,255,0.1)', color: '#fff' },
  };
  const t = map[status] ?? { bg: 'rgba(255,255,255,0.1)', color: '#fff' };
  return { background: t.bg, color: t.color, borderRadius: 99, padding: '3px 10px', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 };
};

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

function formatRelativeTime(date: Date) {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'ADMIN') {
    if (user.role === 'SELLER') redirect('/seller');
    else redirect('/dashboard');
  }

  const db = getDb();

  const [
    totalUsers,
    sellerCount,
    customerCount,
    totalProducts,
    activeProducts,
    featuredProducts,
    recentUsers,
    recentProducts,
    recentActivity,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: 'SELLER' } }),
    db.user.count({ where: { role: 'CUSTOMER' } }),
    db.product.count(),
    db.product.count({ where: { status: 'active' } }),
    db.product.count({ where: { featured: true } }),
    db.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    db.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        seller: { select: { name: true } },
      },
    }),
    db.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: {
        user: { select: { name: true } },
      },
    }),
  ]);

  const stats = [
    { label: 'Total Users', value: formatNumber(totalUsers), change: '+3.4%', up: true, icon: Users, iconBg: 'rgba(99,102,241,0.15)', iconColor: '#818cf8' },
    { label: 'Sellers', value: formatNumber(sellerCount), change: '+2.1%', up: true, icon: Store, iconBg: 'rgba(212,175,55,0.15)', iconColor: '#d4af37' },
    { label: 'Active Products', value: formatNumber(activeProducts), change: '+5.2%', up: true, icon: Package, iconBg: 'rgba(34,197,94,0.15)', iconColor: '#4ade80' },
    { label: 'Customers', value: formatNumber(customerCount), change: '+1.8%', up: true, icon: CreditCard, iconBg: 'rgba(236,72,153,0.15)', iconColor: '#f472b6' },
  ];

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 1400 }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            Welcome back, {user.name.split(' ')[0]} — here&apos;s your live store overview.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '6px 12px' }}>
          <Clock size={12} />
          <span>Updated live</span>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {stats.map((s) => (
          <div key={s.label} style={card}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: s.iconBg, color: s.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={19} />
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#4ade80' }}>
                <TrendingUp size={12} />
                {s.change}
              </span>
            </div>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>{s.value}</p>
            <p style={{ ...labelText, marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Overview panels ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>
        <div style={sectionCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', ...divider }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Recent Signups</h2>
            <Link href="/admin/users" style={{ fontSize: 12, color: '#d4af37', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
              View all <ArrowUpRight size={13} />
            </Link>
          </div>
          {recentUsers.map((entry, index) => (
            <div key={entry.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: index < recentUsers.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 99, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>
                  {entry.name?.[0] ?? entry.email[0].toUpperCase()}
                </div>
                <div>
                  <p style={boldText}>{entry.name || entry.email}</p>
                  <p style={mutedText}>{entry.email}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={statusPill(entry.role.toLowerCase())}>{entry.role.toLowerCase()}</span>
                <p style={{ ...mutedText, marginTop: 6, marginBottom: 0 }}>{formatRelativeTime(entry.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={sectionCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', ...divider }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Inventory Snapshot</h2>
            <Link href="/admin/products" style={{ fontSize: 12, color: '#d4af37', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
              Manage <ArrowUpRight size={13} />
            </Link>
          </div>
          <div style={{ padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={mutedText}>Total products</span>
              <strong style={{ color: '#fff' }}>{formatNumber(totalProducts)}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={mutedText}>Active listings</span>
              <strong style={{ color: '#fff' }}>{formatNumber(activeProducts)}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
              <span style={mutedText}>Featured products</span>
              <strong style={{ color: '#fff' }}>{formatNumber(featuredProducts)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent products + activity ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={sectionCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', ...divider }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Latest Products</h2>
            <Link href="/admin/products" style={{ fontSize: 12, color: '#d4af37', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
              Open catalog <ArrowUpRight size={13} />
            </Link>
          </div>
          {recentProducts.map((product, index) => (
            <div key={product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: index < recentProducts.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div>
                <p style={boldText}>{product.name}</p>
                <p style={mutedText}>{product.seller?.name || 'Unknown seller'} • {product.category}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>NPR {product.price.toLocaleString()}</p>
                <span style={statusPill(product.status)}>{product.status}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={sectionCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', ...divider }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Recent Activity</h2>
            <Link href="/admin/activity" style={{ fontSize: 12, color: '#d4af37', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
              View log <ArrowUpRight size={13} />
            </Link>
          </div>
          {recentActivity.map((entry, index) => (
            <div key={entry.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: index < recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div>
                <p style={boldText}>{entry.action}</p>
                <p style={mutedText}>{entry.user?.name || entry.email}</p>
              </div>
              <span style={{ ...mutedText, textAlign: 'right' }}>{formatRelativeTime(entry.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <p style={{ ...labelText, marginBottom: 14 }}>Quick Actions</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14 }}>
          {[
            { label: 'Add Product', href: '/admin/products/add', icon: Package, iconBg: 'rgba(212,175,55,0.15)', iconColor: '#d4af37' },
            { label: 'Manage Users', href: '/admin/users', icon: Users, iconBg: 'rgba(99,102,241,0.15)', iconColor: '#818cf8' },
            { label: 'View Orders', href: '/admin/orders', icon: ShoppingBag, iconBg: 'rgba(34,197,94,0.15)', iconColor: '#4ade80' },
            { label: 'Store Settings', href: '/admin/settings', icon: Store, iconBg: 'rgba(236,72,153,0.15)', iconColor: '#f472b6' },
          ].map(({ label, href, icon: Icon, iconBg, iconColor }) => (
            <Link key={label} href={href} style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center', textDecoration: 'none', transition: 'border-color 0.2s', cursor: 'pointer' }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
