import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  DollarSign, ShoppingBag, Package, Users,
  PlusCircle, TrendingUp, TrendingDown, ArrowUpRight,
  Clock, CheckCircle, AlertTriangle, Sparkles,
} from 'lucide-react';

const sampleProducts = [
  { id: '1', name: 'Twist Knot Earrings',  sku: 'EAR-001', category: 'Earrings',  price: 'NPR 1,850', stock: 24, status: 'Active' },
  { id: '2', name: 'Chunky Hoop Earrings', sku: 'EAR-002', category: 'Earrings',  price: 'NPR 2,200', stock: 18, status: 'Active' },
  { id: '3', name: 'Pearl Drop Earrings',  sku: 'EAR-003', category: 'Earrings',  price: 'NPR 1,600', stock: 5,  status: 'Low Stock' },
  { id: '4', name: 'Chain Link Bracelet',  sku: 'BRC-001', category: 'Bracelets', price: 'NPR 2,400', stock: 12, status: 'Active' },
];

const recentOrders = [
  { id: '#SL-441', customer: 'Anjali R.',  amount: 'NPR 3,700', status: 'delivered', time: '1h ago' },
  { id: '#SL-440', customer: 'Ravi K.',    amount: 'NPR 1,600', status: 'pending',   time: '4h ago' },
  { id: '#SL-439', customer: 'Sushma T.', amount: 'NPR 4,400', status: 'shipped',   time: '8h ago' },
];

const cardStyle: React.CSSProperties = {
  background: '#161622',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 20,
};

const statusBadge = (status: string): React.CSSProperties => {
  const map: Record<string, { bg: string; color: string }> = {
    Active:     { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80' },
    'Low Stock': { bg: 'rgba(245,158,11,0.15)',  color: '#fbbf24' },
    delivered:  { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80' },
    pending:    { bg: 'rgba(245,158,11,0.15)',  color: '#fbbf24' },
    shipped:    { bg: 'rgba(99,102,241,0.15)',  color: '#818cf8' },
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
  };
};

export default async function SellerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'SELLER' && user.role !== 'ADMIN') redirect('/dashboard');

  const firstName = user.name ? user.name.split(' ')[0] : 'Seller';

  const stats = [
    { label: 'Total Revenue',   value: 'NPR 12,450', change: '+14.2%', up: true,  icon: DollarSign,  iconBg: 'rgba(212,175,55,0.15)',  iconColor: '#d4af37' },
    { label: 'Total Orders',    value: '384',         change: '+8.1%',  up: true,  icon: ShoppingBag, iconBg: 'rgba(99,102,241,0.15)', iconColor: '#818cf8' },
    { label: 'Active Products', value: '42',          change: '+4',     up: true,  icon: Package,     iconBg: 'rgba(34,197,94,0.15)',  iconColor: '#4ade80' },
    { label: 'Customers',       value: '1,280',       change: '+18.6%', up: true,  icon: Users,       iconBg: 'rgba(236,72,153,0.15)', iconColor: '#f472b6' },
  ];

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 1400 }}>

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
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: '#d4af37', textTransform: 'uppercase' }}>
            SELLER PORTAL
          </span>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '6px 0 4px 0' }}>
            Welcome back, {firstName}!
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            Manage your catalog, track store orders, and expand your inventory.
          </p>
        </div>

        <Link
          href="/seller/products/add"
          style={{
            padding: '12px 24px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, #d4af37, #a07c2e)',
            color: '#000000',
            fontSize: 13,
            fontWeight: 700,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 14px rgba(212,175,55,0.3)',
          }}
        >
          <PlusCircle size={16} />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* ── Stats Grid ──────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ ...cardStyle, padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: s.iconBg, color: s.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={19} />
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: s.up ? '#4ade80' : '#f87171' }}>
                {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {s.change}
              </span>
            </div>
            <p style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>{s.value}</p>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Products Table + Orders Panel ────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        
        {/* Products Table */}
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: 0 }}>Products Catalog</h2>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0 0' }}>Your listed items</p>
            </div>
            <Link href="/seller/products/add" style={{ fontSize: 12, fontWeight: 600, color: '#d4af37', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Add Product <ArrowUpRight size={13} />
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <th style={{ padding: '14px 24px' }}>Product</th>
                  <th style={{ padding: '14px 24px' }}>SKU</th>
                  <th style={{ padding: '14px 24px' }}>Category</th>
                  <th style={{ padding: '14px 24px' }}>Price</th>
                  <th style={{ padding: '14px 24px' }}>Stock</th>
                  <th style={{ padding: '14px 24px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {sampleProducts.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < sampleProducts.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                    <td style={{ padding: '14px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(212,175,55,0.12)', color: '#d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>
                          {p.name[0]}
                        </div>
                        <span style={{ fontWeight: 600, color: '#ffffff' }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 24px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)' }}>{p.sku}</td>
                    <td style={{ padding: '14px 24px', color: 'rgba(255,255,255,0.6)' }}>{p.category}</td>
                    <td style={{ padding: '14px 24px', fontWeight: 700, color: '#ffffff' }}>{p.price}</td>
                    <td style={{ padding: '14px 24px', color: 'rgba(255,255,255,0.6)' }}>{p.stock} units</td>
                    <td style={{ padding: '14px 24px' }}>
                      <span style={statusBadge(p.status)}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders Panel */}
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: 0 }}>Recent Orders</h2>
            <Link href="/seller/orders" style={{ fontSize: 12, fontWeight: 600, color: '#d4af37', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ArrowUpRight size={13} />
            </Link>
          </div>

          <div>
            {recentOrders.map((o, i) => (
              <div key={o.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 24px', borderBottom: i < recentOrders.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 99, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>
                    {o.customer[0]}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', margin: 0 }}>{o.customer}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: '2px 0 0 0' }}>{o.id} · {o.time}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', margin: 0 }}>{o.amount}</p>
                  <span style={statusBadge(o.status)}>
                    {o.status === 'delivered' && <CheckCircle size={11} />}
                    {o.status === 'pending'   && <Clock size={11} />}
                    {o.status === 'shipped'   && <AlertTriangle size={11} />}
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
