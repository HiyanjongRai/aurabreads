import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';
import Link from 'next/link';
import { ArrowUpRight, Search, Filter, Users, ShoppingBag, CheckCircle2, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

function formatDate(date: Date | string) {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(d);
}

export default async function AdminCustomersPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'ADMIN') redirect('/dashboard');

  const db = getDb();
  const [customers, totalCustomers] = await Promise.all([
    db.user.findMany({
      where: { role: 'CUSTOMER' },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        isVerified: true,
      },
    }),
    db.user.count({ where: { role: 'CUSTOMER' } }),
  ]);

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1400 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 99, border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.08)', padding: '4px 12px', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: '#d4af37', textTransform: 'uppercase' }}>
            <Sparkles size={12} />
            Customer Hub
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '8px 0 0' }}>
            Customers
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            Review your customer base, verified accounts, and recent signups.
          </p>
        </div>

        <Link href="/admin/users" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#d4af37', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
          Back to all users <ArrowUpRight size={13} />
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div style={{ background: '#161622', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Total Customers</p>
              <p style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', margin: '6px 0 0' }}>{totalCustomers}</p>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(129,140,248,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
              <Users size={18} />
            </div>
          </div>
        </div>

        <div style={{ background: '#161622', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Verified Accounts</p>
              <p style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', margin: '6px 0 0' }}>{customers.filter((entry) => entry.isVerified).length}</p>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(52,211,153,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
        </div>

        <div style={{ background: '#161622', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Recent Signups</p>
              <p style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', margin: '6px 0 0' }}>{customers.slice(0, 5).length}</p>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(212,175,55,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>
              <ShoppingBag size={18} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: '#161622', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 18 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '9px 14px' }}>
            <Search size={16} color="rgba(255,255,255,0.3)" />
            <input
              placeholder="Search customer by name or email…"
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#ffffff', fontSize: 13, width: '100%' }}
            />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', padding: '9px 14px', fontSize: 13 }}>
            <Filter size={15} />
            Filter
          </button>
        </div>
      </div>

      <div style={{ background: '#161622', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Customer</th>
                <th style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Email</th>
                <th style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 99, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#ffffff' }}>
                        {(customer.name || customer.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: 0 }}>{customer.name || 'Anonymous Customer'}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.7)' }}>{customer.email}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: customer.isVerified ? '#34d399' : '#f59e0b', fontSize: 12, fontWeight: 600 }}>
                      <CheckCircle2 size={13} />
                      {customer.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{formatDate(customer.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
