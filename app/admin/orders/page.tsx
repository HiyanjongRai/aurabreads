import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Search, Filter, Download, CheckCircle, Clock, Truck, XCircle, MoreHorizontal } from 'lucide-react';

const orders = [
  { id: '#ORD-8821', customer: 'Priya Sharma',   items: 2, total: 'NPR 2,450', status: 'delivered',  date: '24 Jul 2026', payment: 'eSewa'  },
  { id: '#ORD-8820', customer: 'Arun Thapa',     items: 1, total: 'NPR 890',   status: 'pending',    date: '24 Jul 2026', payment: 'COD'    },
  { id: '#ORD-8819', customer: 'Sita Karki',     items: 3, total: 'NPR 3,200', status: 'processing', date: '23 Jul 2026', payment: 'Khalti' },
  { id: '#ORD-8818', customer: 'Bikash Rai',     items: 1, total: 'NPR 1,100', status: 'delivered',  date: '22 Jul 2026', payment: 'Card'   },
  { id: '#ORD-8817', customer: 'Mina Gurung',    items: 4, total: 'NPR 4,800', status: 'cancelled',  date: '21 Jul 2026', payment: 'eSewa'  },
  { id: '#ORD-8816', customer: 'Suraj Lama',     items: 2, total: 'NPR 2,100', status: 'shipped',    date: '20 Jul 2026', payment: 'COD'    },
  { id: '#ORD-8815', customer: 'Kavita Basnet',  items: 1, total: 'NPR 1,850', status: 'delivered',  date: '19 Jul 2026', payment: 'Khalti' },
];

const statusConfig: Record<string, { label: string; class: string; icon: React.ReactNode }> = {
  delivered:  { label: 'Delivered',  class: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20', icon: <CheckCircle size={11} /> },
  pending:    { label: 'Pending',    class: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',       icon: <Clock size={11} /> },
  processing: { label: 'Processing', class: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',          icon: <Clock size={11} /> },
  shipped:    { label: 'Shipped',    class: 'bg-purple-500/15 text-purple-400 border border-purple-500/20',    icon: <Truck size={11} /> },
  cancelled:  { label: 'Cancelled',  class: 'bg-red-500/15 text-red-400 border border-red-500/20',             icon: <XCircle size={11} /> },
};

export default async function AdminOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'ADMIN') redirect('/dashboard');

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Orders</h1>
          <p className="text-white/40 text-sm mt-0.5">Track and manage all store orders.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/50 hover:text-white hover:border-white/20 transition">
          <Download size={15} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summary tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { label: 'All Orders', count: '1,284' },
          { label: 'Pending',    count: '42' },
          { label: 'Processing', count: '18' },
          { label: 'Shipped',    count: '93' },
          { label: 'Delivered',  count: '1,105' },
          { label: 'Cancelled',  count: '26' },
        ].map((tab, i) => (
          <button key={tab.label}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition ${
              i === 0 ? 'text-black' : 'text-white/40 border border-white/10 hover:text-white hover:border-white/20'
            }`}
            style={i === 0 ? { background: 'linear-gradient(135deg, #d4af37, #a07c2e)' } : {}}>
            {tab.label}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${i === 0 ? 'bg-black/20 text-black' : 'bg-white/10 text-white/50'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="flex items-center gap-2 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
          <Search size={15} className="text-white/30" />
          <input placeholder="Search order ID or customer…" className="bg-transparent text-sm text-white placeholder-white/30 outline-none flex-1" />
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/50 hover:text-white hover:border-white/20 transition">
          <Filter size={15} />
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/5 text-white/30 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4 hidden sm:table-cell">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 hidden md:table-cell">Payment</th>
                <th className="px-6 py-4 hidden lg:table-cell">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((o) => {
                const s = statusConfig[o.status];
                return (
                  <tr key={o.id} className="hover:bg-white/[0.02] transition">
                    <td className="px-6 py-4 font-mono font-semibold text-white">{o.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-black flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #d4af37, #a07c2e)' }}>
                          {o.customer[0]}
                        </div>
                        <span className="font-medium text-white">{o.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell text-white/50">{o.items} item{o.items > 1 ? 's' : ''}</td>
                    <td className="px-6 py-4 font-bold text-white">{o.total}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${s.class}`}>
                        {s.icon}
                        {s.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-white/50">{o.payment}</td>
                    <td className="px-6 py-4 hidden lg:table-cell text-white/40">{o.date}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
          <span className="text-xs text-white/30">Showing 7 of 1,284 orders</span>
          <div className="flex items-center gap-1">
            {['1','2','3','…','183'].map((p) => (
              <button key={p} className={`min-w-[32px] h-8 rounded-lg text-xs font-medium transition ${
                p === '1' ? 'text-black' : 'text-white/40 hover:text-white hover:bg-white/5'
              }`} style={p === '1' ? { background: 'linear-gradient(135deg, #d4af37, #a07c2e)' } : {}}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
