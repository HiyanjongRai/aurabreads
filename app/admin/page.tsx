import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  Users, ShoppingBag, Package, CreditCard,
  TrendingUp, TrendingDown, CheckCircle, Clock,
  Store, Activity, ArrowUpRight, AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

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
    delivered:  { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80' },
    pending:    { bg: 'rgba(245,158,11,0.15)',  color: '#fbbf24' },
    processing: { bg: 'rgba(99,102,241,0.15)',  color: '#818cf8' },
    cancelled:  { bg: 'rgba(239,68,68,0.15)',   color: '#f87171' },
    active:     { bg: 'rgba(34,197,94,0.15)',   color: '#4ade80' },
  };
  const t = map[status] ?? { bg: 'rgba(255,255,255,0.1)', color: '#fff' };
  return { background: t.bg, color: t.color, borderRadius: 99, padding: '3px 10px', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 };
};

/* ── Data ──────────────────────────────────────────────────────────────────── */
const stats = [
  { label: 'Total Revenue',   value: 'NPR 1,24,580', change: '+12.5%', up: true,  icon: CreditCard, iconBg: 'rgba(212,175,55,0.15)',  iconColor: '#d4af37' },
  { label: 'Total Orders',    value: '1,284',         change: '+8.2%',  up: true,  icon: ShoppingBag, iconBg: 'rgba(99,102,241,0.15)', iconColor: '#818cf8' },
  { label: 'Active Products', value: '342',           change: '+3.1%',  up: true,  icon: Package,    iconBg: 'rgba(34,197,94,0.15)',  iconColor: '#4ade80' },
  { label: 'Total Users',     value: '4,871',         change: '-0.4%',  up: false, icon: Users,      iconBg: 'rgba(236,72,153,0.15)', iconColor: '#f472b6' },
];

const recentOrders = [
  { id: '#ORD-8821', customer: 'Priya Sharma',  amount: 'NPR 2,450', status: 'delivered',  time: '2h ago' },
  { id: '#ORD-8820', customer: 'Arun Thapa',   amount: 'NPR 890',   status: 'pending',    time: '3h ago' },
  { id: '#ORD-8819', customer: 'Sita Karki',   amount: 'NPR 3,200', status: 'processing', time: '5h ago' },
  { id: '#ORD-8818', customer: 'Bikash Rai',   amount: 'NPR 1,100', status: 'delivered',  time: '7h ago' },
  { id: '#ORD-8817', customer: 'Mina Gurung',  amount: 'NPR 4,800', status: 'cancelled',  time: '1d ago' },
];

const topSellers = [
  { name: 'Luxora Jewels', products: 48, revenue: 'NPR 32,400', status: 'active' },
  { name: 'Golden Craft',  products: 31, revenue: 'NPR 21,750', status: 'active' },
  { name: 'Bead World',    products: 27, revenue: 'NPR 18,200', status: 'active' },
  { name: 'Silver Lane',   products: 19, revenue: 'NPR 12,900', status: 'pending' },
];

const statusIcons: Record<string, React.ReactNode> = {
  delivered:  <CheckCircle size={11} />,
  pending:    <Clock size={11} />,
  processing: <Activity size={11} />,
  cancelled:  <AlertTriangle size={11} />,
  active:     <CheckCircle size={11} />,
};

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'ADMIN') {
    if (user.role === 'SELLER') redirect('/seller');
    else redirect('/dashboard');
  }

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 1400 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            Welcome back, {user.name.split(' ')[0]} — here&apos;s your store overview.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '6px 12px' }}>
          <Clock size={12} />
          <span>Updated just now</span>
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
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: s.up ? '#4ade80' : '#f87171' }}>
                {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {s.change}
              </span>
            </div>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>{s.value}</p>
            <p style={{ ...labelText, marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Orders + Sellers ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>

          {/* Recent Orders */}
          <div style={sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', ...divider }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Recent Orders</h2>
              <Link href="/admin/orders" style={{ fontSize: 12, color: '#d4af37', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                View all <ArrowUpRight size={13} />
              </Link>
            </div>
            {recentOrders.map((o, i) => (
              <div key={o.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 24px', borderBottom: i < recentOrders.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 99, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>
                    {o.customer[0]}
                  </div>
                  <div>
                    <p style={boldText}>{o.customer}</p>
                    <p style={mutedText}>{o.id}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{o.amount}</span>
                  <span style={statusPill(o.status)}>
                    {statusIcons[o.status]} <span style={{ textTransform: 'capitalize' }}>{o.status}</span>
                  </span>
                  <span style={mutedText}>{o.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Top Sellers */}
          <div style={sectionCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', ...divider }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Top Sellers</h2>
              <Link href="/admin/users/sellers" style={{ fontSize: 12, color: '#d4af37', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                View all <ArrowUpRight size={13} />
              </Link>
            </div>
            {topSellers.map((s, i) => (
              <div key={s.name} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 24px', borderBottom: i < topSellers.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.2)', width: 16 }}>{i + 1}</span>
                  <div style={{ width: 32, height: 32, borderRadius: 99, background: 'linear-gradient(135deg,#d4af37,#a07c2e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#000' }}>
                    {s.name[0]}
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', margin: 0 }}>{s.name}</p>
                    <p style={mutedText}>{s.products} products</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', margin: 0 }}>{s.revenue}</p>
                  <span style={statusPill(s.status)}>{statusIcons[s.status]} {s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <p style={{ ...labelText, marginBottom: 14 }}>Quick Actions</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { label: 'Add Product',   href: '/admin/products/add', icon: Package,   iconBg: 'rgba(212,175,55,0.15)',  iconColor: '#d4af37' },
            { label: 'Manage Users',  href: '/admin/users',        icon: Users,     iconBg: 'rgba(99,102,241,0.15)',  iconColor: '#818cf8' },
            { label: 'View Orders',   href: '/admin/orders',       icon: ShoppingBag, iconBg: 'rgba(34,197,94,0.15)', iconColor: '#4ade80' },
            { label: 'Store Settings',href: '/admin/settings',     icon: Store,     iconBg: 'rgba(236,72,153,0.15)', iconColor: '#f472b6' },
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
