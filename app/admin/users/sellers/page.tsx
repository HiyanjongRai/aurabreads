import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Search, Filter, PlusCircle, Store, CheckCircle, Clock, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const sellers = [
  { id: '1', name: 'Anjali Sharma',  store: 'Luxora Jewels & Craft', email: 'seller@luxora.com',   products: 48, revenue: 'NPR 32,400', status: 'active',   joined: '12 Jan 2026' },
  { id: '2', name: 'Golden Craft',   store: 'Golden Craft Studio',   email: 'info@goldencraft.np', products: 31, revenue: 'NPR 21,750', status: 'active',   joined: '5 Feb 2026' },
  { id: '3', name: 'Bead World',     store: 'Bead World Nepal',      email: 'contact@beadworld.np',products: 27, revenue: 'NPR 18,200', status: 'active',   joined: '18 Mar 2026' },
  { id: '4', name: 'Silver Lane',    store: 'Silver Lane Jewelry',   email: 'sales@silverlane.np', products: 19, revenue: 'NPR 12,900', status: 'pending',  joined: '2 Apr 2026' },
];

export default async function SellersListPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'ADMIN') redirect('/dashboard');

  return (
    <div className="dashboard-page-container" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', margin: 0 }}>Sellers</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Manage registered store owners and vendor partners.</p>
        </div>

        <Link
          href="/admin/users/sellers/create"
          style={{
            padding: '10px 20px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, #d4af37, #a07c2e)',
            color: '#000',
            fontWeight: 700,
            fontSize: 13,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 14px rgba(212,175,55,0.3)',
          }}
        >
          <PlusCircle size={16} />
          <span>Create Seller</span>
        </Link>
      </div>

      {/* Stats summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        {[
          { label: 'Total Sellers', value: '4' },
          { label: 'Active Sellers', value: '3' },
          { label: 'Pending Approval', value: '1' },
          { label: 'Total Vendor Revenue', value: 'NPR 85,250' },
        ].map((s) => (
          <div key={s.label} style={{ background: '#161622', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '16px 20px' }}>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>{s.value}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#161622', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <th style={{ padding: '14px 24px' }}>Store & Owner</th>
                <th style={{ padding: '14px 24px' }}>Email</th>
                <th style={{ padding: '14px 24px' }}>Products</th>
                <th style={{ padding: '14px 24px' }}>Revenue</th>
                <th style={{ padding: '14px 24px' }}>Status</th>
                <th style={{ padding: '14px 24px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: i < sellers.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 99, background: 'linear-gradient(135deg, #d4af37, #a07c2e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#000', fontSize: 13 }}>
                        {s.store[0]}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: '#fff', margin: 0 }}>{s.store}</p>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Owner: {s.name}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', color: 'rgba(255,255,255,0.6)' }}>{s.email}</td>
                  <td style={{ padding: '16px 24px', color: '#fff', fontWeight: 600 }}>{s.products}</td>
                  <td style={{ padding: '16px 24px', color: '#fff', fontWeight: 700 }}>{s.revenue}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
                      background: s.status === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                      color: s.status === 'active' ? '#4ade80' : '#fbbf24',
                    }}>
                      {s.status === 'active' ? <CheckCircle size={11} /> : <Clock size={11} />}
                      <span style={{ textTransform: 'capitalize' }}>{s.status}</span>
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 4 }}>
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
