import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import {
  DollarSign, ShoppingBag, Package, TrendingUp,
  PlusCircle, ArrowUpRight, AlertTriangle, CheckCircle2,
  XCircle, Sparkles, Star, Eye, BarChart3,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

type ProductRow = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  images: string[];
  featured: boolean;
  createdAt: Date;
};

type SellerStats = {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalInventoryValue: number;
  recentProducts: ProductRow[];
  categoryBreakdown: { category: string; count: number }[];
};

async function getSellerDashboardData(sellerId: string): Promise<SellerStats> {
  try {
    const db = getDb();
    const products = await db.product.findMany({
      where: { sellerId },
      select: {
        id: true,
        name: true,
        category: true,
        price: true,
        stock: true,
        status: true,
        images: true,
        featured: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const active = products.filter((p) => p.status === 'active' || p.status === 'Active');
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10);
    const outOfStock = products.filter((p) => p.stock === 0);
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

    // Category breakdown
    const catMap: Record<string, number> = {};
    for (const p of products) {
      catMap[p.category] = (catMap[p.category] || 0) + 1;
    }
    const categoryBreakdown = Object.entries(catMap)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalProducts: products.length,
      activeProducts: active.length,
      lowStockProducts: lowStock.length,
      outOfStockProducts: outOfStock.length,
      totalInventoryValue: totalValue,
      recentProducts: products.slice(0, 6),
      categoryBreakdown,
    };
  } catch {
    return {
      totalProducts: 0,
      activeProducts: 0,
      lowStockProducts: 0,
      outOfStockProducts: 0,
      totalInventoryValue: 0,
      recentProducts: [],
      categoryBreakdown: [],
    };
  }
}

export default async function SellerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'SELLER' && user.role !== 'ADMIN') redirect('/dashboard');

  const firstName = user.name ? user.name.split(' ')[0] : 'Seller';
  const data = await getSellerDashboardData(user.id);

  const statCards = [
    {
      label: 'Total Products',
      value: data.totalProducts.toString(),
      sub: `${data.activeProducts} active`,
      icon: Package,
      iconBg: 'rgba(212,175,55,0.15)',
      iconColor: '#d4af37',
      accent: '#d4af37',
    },
    {
      label: 'Inventory Value',
      value: `NPR ${data.totalInventoryValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      sub: 'at current prices',
      icon: DollarSign,
      iconBg: 'rgba(99,102,241,0.15)',
      iconColor: '#818cf8',
      accent: '#818cf8',
    },
    {
      label: 'Low Stock Items',
      value: data.lowStockProducts.toString(),
      sub: 'Need restocking soon',
      icon: AlertTriangle,
      iconBg: 'rgba(245,158,11,0.15)',
      iconColor: '#fbbf24',
      accent: '#fbbf24',
    },
    {
      label: 'Out of Stock',
      value: data.outOfStockProducts.toString(),
      sub: 'Currently unavailable',
      icon: XCircle,
      iconBg: 'rgba(239,68,68,0.15)',
      iconColor: '#f87171',
      accent: '#f87171',
    },
  ];

  const getStatusStyle = (status: string, stock: number) => {
    if (stock === 0) return { bg: 'rgba(239,68,68,0.15)', color: '#f87171', label: 'Out of Stock' };
    if (stock <= 10) return { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', label: 'Low Stock' };
    if (status === 'active' || status === 'Active') return { bg: 'rgba(34,197,94,0.15)', color: '#4ade80', label: 'Active' };
    return { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', label: status };
  };

  return (
    <div className="dashboard-page-container" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 1400, fontFamily: 'Inter, sans-serif' }}>

      {/* ── Welcome Banner ────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1c1829 0%, #1a1508 60%, #0f0f1a 100%)',
        border: '1px solid rgba(212,175,55,0.2)',
        borderRadius: 24,
        padding: '28px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: -40, right: 80, width: 200, height: 200, borderRadius: '50%', background: 'rgba(212,175,55,0.05)', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 99, padding: '4px 12px', marginBottom: 12 }}>
            <Sparkles size={11} color="#d4af37" />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', color: '#d4af37', textTransform: 'uppercase' }}>SELLER PORTAL</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 6px' }}>
            Welcome back, {firstName}! 👋
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            You have <strong style={{ color: '#fbbf24' }}>{data.lowStockProducts}</strong> low-stock items and{' '}
            <strong style={{ color: '#f87171' }}>{data.outOfStockProducts}</strong> out-of-stock products.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', position: 'relative' }}>
          <Link
            href="/seller/products"
            style={{
              padding: '11px 20px', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.05)',
              color: '#ffffff', fontSize: 13, fontWeight: 600,
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <Eye size={15} />
            View Products
          </Link>
          <Link
            href="/seller/products/add"
            style={{
              padding: '11px 22px', borderRadius: 12,
              background: 'linear-gradient(135deg, #d4af37, #a07c2e)',
              color: '#000000', fontSize: 13, fontWeight: 700,
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 4px 16px rgba(212,175,55,0.3)',
            }}
          >
            <PlusCircle size={15} />
            Add New Product
          </Link>
        </div>
      </div>

      {/* ── Stats Grid ────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {statCards.map((s) => (
          <div
            key={s.label}
            style={{
              background: '#161622',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20,
              padding: '22px 24px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', bottom: -20, right: -10, width: 80, height: 80, borderRadius: '50%', background: s.iconBg, filter: 'blur(20px)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={20} color={s.iconColor} />
              </div>
              <TrendingUp size={13} color="rgba(255,255,255,0.2)" />
            </div>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.03em' }}>{s.value}</p>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
            <p style={{ fontSize: 11, color: s.accent, margin: '2px 0 0' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Products Table + Category Breakdown ───────────────────────────────── */}
      <div className="responsive-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

        {/* Recent Products Table */}
        <div style={{ background: '#161622', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', margin: 0 }}>Recent Listings</h2>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>
                Showing latest {data.recentProducts.length} of {data.totalProducts} products
              </p>
            </div>
            <Link
              href="/seller/products"
              style={{ fontSize: 12, fontWeight: 600, color: '#d4af37', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              View all <ArrowUpRight size={13} />
            </Link>
          </div>

          {data.recentProducts.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 18, background: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Package size={24} color="#d4af37" />
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', margin: '0 0 8px' }}>No products yet</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 0 20px' }}>Add your first product to start selling.</p>
              <Link
                href="/seller/products/add"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 20px', borderRadius: 12,
                  background: 'linear-gradient(135deg, #d4af37, #a07c2e)',
                  color: '#000', fontSize: 13, fontWeight: 700, textDecoration: 'none',
                }}
              >
                <PlusCircle size={15} /> Add First Product
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['Product', 'Category', 'Price', 'Stock', 'Status'].map((h) => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.recentProducts.map((p) => {
                    const statusStyle = getStatusStyle(p.status, p.stock);
                    const img = p.images?.[0];
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                              width: 40, height: 40, borderRadius: 10,
                              overflow: 'hidden', flexShrink: 0,
                              background: 'rgba(212,175,55,0.1)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              {img ? (
                                <img src={img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <Package size={16} color="#d4af37" />
                              )}
                            </div>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', margin: 0, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                              {p.featured && (
                                <span style={{ fontSize: 10, color: '#d4af37', display: 'flex', alignItems: 'center', gap: 3 }}>
                                  <Star size={9} /> Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>{p.category}</td>
                        <td style={{ padding: '14px 20px', fontWeight: 700, color: '#ffffff' }}>NPR {p.price.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '14px 20px', color: p.stock <= 10 ? '#fbbf24' : 'rgba(255,255,255,0.6)' }}>{p.stock} units</td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '3px 10px', borderRadius: 99,
                            background: statusStyle.bg, color: statusStyle.color,
                            fontSize: 11, fontWeight: 700,
                          }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: statusStyle.color }} />
                            {statusStyle.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Category Breakdown */}
          <div style={{ background: '#161622', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <BarChart3 size={16} color="#d4af37" />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: 0 }}>By Category</h3>
            </div>
            {data.categoryBreakdown.length === 0 ? (
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '16px 0' }}>No data yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.categoryBreakdown.map((c, i) => {
                  const pct = data.totalProducts > 0 ? Math.round((c.count / data.totalProducts) * 100) : 0;
                  const colors = ['#d4af37', '#818cf8', '#34d399', '#f472b6', '#60a5fa'];
                  const color = colors[i % colors.length];
                  return (
                    <div key={c.category}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{c.category}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color }}>{c.count} ({pct}%)</span>
                      </div>
                      <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
                        <div style={{ height: '100%', width: `${pct}%`, borderRadius: 99, background: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ background: '#161622', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '20px' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: '0 0 14px' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { href: '/seller/products/add', label: 'Add New Product', icon: PlusCircle, color: '#d4af37' },
                { href: '/seller/products', label: 'Manage Products', icon: Package, color: '#818cf8' },
                { href: '/', label: 'View Live Store', icon: Eye, color: '#34d399' },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  target={action.href === '/' ? '_blank' : undefined}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(255,255,255,0.02)',
                    textDecoration: 'none', color: 'rgba(255,255,255,0.7)',
                    fontSize: 13, fontWeight: 600,
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: `rgba(${action.color === '#d4af37' ? '212,175,55' : action.color === '#818cf8' ? '99,102,241' : '34,197,94'},0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <action.icon size={15} color={action.color} />
                  </div>
                  {action.label}
                  <ArrowUpRight size={13} color="rgba(255,255,255,0.3)" style={{ marginLeft: 'auto' }} />
                </Link>
              ))}
            </div>
          </div>

          {/* Stock Alerts */}
          {(data.lowStockProducts > 0 || data.outOfStockProducts > 0) && (
            <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 20, padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <AlertTriangle size={15} color="#fbbf24" />
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24', margin: 0 }}>Stock Alerts</h3>
              </div>
              {data.outOfStockProducts > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', marginBottom: 6 }}>
                  <XCircle size={13} color="#f87171" />
                  <span style={{ fontSize: 12, color: '#f87171', fontWeight: 600 }}>{data.outOfStockProducts} product(s) out of stock</span>
                </div>
              )}
              {data.lowStockProducts > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 10, background: 'rgba(245,158,11,0.1)' }}>
                  <AlertTriangle size={13} color="#fbbf24" />
                  <span style={{ fontSize: 12, color: '#fbbf24', fontWeight: 600 }}>{data.lowStockProducts} product(s) running low</span>
                </div>
              )}
              <Link href="/seller/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 12, fontWeight: 600, color: '#d4af37', textDecoration: 'none' }}>
                Manage Inventory <ArrowUpRight size={12} />
              </Link>
            </div>
          )}

          {/* Seller Info Card */}
          <div style={{ background: '#161622', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 99, background: 'linear-gradient(135deg,#d4af37,#a07c2e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#000', flexShrink: 0 }}>
                {user.name?.[0]?.toUpperCase() || 'S'}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Role</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#d4af37' }}>{user.role}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Verified</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: user.isVerified ? '#4ade80' : '#f87171' }}>
                  {user.isVerified ? '✓ Yes' : '✗ No'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Joined</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
                  {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Completion Checklist ──────────────────────────────────────────────── */}
      <div style={{ background: '#161622', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <CheckCircle2 size={18} color="#34d399" />
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', margin: 0 }}>Seller Checklist</h3>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>— Get your store ready to sell</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
          {[
            { done: data.totalProducts > 0, label: 'Add your first product', href: '/seller/products/add' },
            { done: user.isVerified, label: 'Verify your account', href: '/seller/settings' },
            { done: data.activeProducts > 0, label: 'Activate a listing', href: '/seller/products' },
            { done: data.totalProducts >= 5, label: 'Reach 5+ products', href: '/seller/products/add' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px', borderRadius: 14,
                background: item.done ? 'rgba(34,197,94,0.07)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${item.done ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}`,
                textDecoration: 'none',
              }}
            >
              <div style={{ width: 22, height: 22, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', background: item.done ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)', flexShrink: 0 }}>
                {item.done
                  ? <CheckCircle2 size={13} color="#4ade80" />
                  : <span style={{ width: 8, height: 8, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', display: 'block' }} />
                }
              </div>
              <span style={{ fontSize: 12, fontWeight: item.done ? 600 : 500, color: item.done ? '#4ade80' : 'rgba(255,255,255,0.55)', textDecoration: item.done ? 'line-through' : 'none' }}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
