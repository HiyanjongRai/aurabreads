import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Package, CheckCircle, Truck, Clock, XCircle, ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';

const orders = [
  { id: '#AB-4421', product: 'Gold Bead Bracelet',       items: 1, price: 'NPR 1,850', status: 'delivered',  date: '20 Jul 2026', address: 'Kathmandu, Nepal' },
  { id: '#AB-4398', product: 'Pearl Drop Earrings',      items: 1, price: 'NPR 2,200', status: 'shipped',    date: '17 Jul 2026', address: 'Lalitpur, Nepal'  },
  { id: '#AB-4371', product: 'Crystal Necklace Set',     items: 2, price: 'NPR 3,400', status: 'processing', date: '12 Jul 2026', address: 'Kathmandu, Nepal' },
  { id: '#AB-4312', product: 'Rose Gold Bangles Set',    items: 3, price: 'NPR 4,100', status: 'delivered',  date: '2 Jul 2026',  address: 'Bhaktapur, Nepal' },
  { id: '#AB-4280', product: 'Silver Anklet',            items: 1, price: 'NPR 1,400', status: 'cancelled',  date: '25 Jun 2026', address: 'Kathmandu, Nepal' },
];

const statusConfig: Record<string, { label: string; class: string; icon: React.ReactNode; step: number }> = {
  processing: { label: 'Processing', class: 'bg-amber-500/15 text-amber-400',  icon: <Clock size={11} />,     step: 1 },
  shipped:    { label: 'Shipped',    class: 'bg-blue-500/15 text-blue-400',    icon: <Truck size={11} />,     step: 2 },
  delivered:  { label: 'Delivered', class: 'bg-emerald-500/15 text-emerald-400', icon: <CheckCircle size={11} />, step: 3 },
  cancelled:  { label: 'Cancelled', class: 'bg-red-500/15 text-red-400',       icon: <XCircle size={11} />,   step: 0 },
};

export default async function CustomerOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role === 'ADMIN') redirect('/admin');
  if (user.role === 'SELLER') redirect('/seller');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">My Orders</h1>
            <p className="text-white/40 text-sm">Track all your purchases</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
        <Search size={15} className="text-white/30" />
        <input placeholder="Search orders…" className="bg-transparent text-sm text-white placeholder-white/30 outline-none flex-1" />
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {orders.map((o) => {
          const s = statusConfig[o.status];
          return (
            <div key={o.id} className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0"
                    style={{ background: 'rgba(212,175,55,0.1)' }}>
                    <Package size={20} className="text-[#d4af37]" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{o.product}</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {o.id} · {o.items} item{o.items > 1 ? 's' : ''} · {o.date}
                    </p>
                    <p className="text-xs text-white/30 mt-0.5">{o.address}</p>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1.5">
                  <p className="text-base font-bold text-white">{o.price}</p>
                  <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${s.class}`}>
                    {s.icon} {s.label}
                  </span>
                </div>
              </div>

              {/* Progress bar for non-cancelled */}
              {o.status !== 'cancelled' && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    {['Ordered', 'Processing', 'Shipped', 'Delivered'].map((step, i) => {
                      const done = i < s.step;
                      const active = i === s.step - 1;
                      return (
                        <div key={step} className="flex flex-col items-center gap-1.5 flex-1">
                          <div className={`h-2 w-full rounded-full transition-all ${
                            done ? '' : active ? '' : 'bg-white/10'
                          }`}
                          style={done ? { background: 'linear-gradient(90deg, #d4af37, #a07c2e)' } :
                            active ? { background: 'rgba(212,175,55,0.3)' } : {}}>
                          </div>
                          <span className={`text-[10px] font-medium ${done ? 'text-[#d4af37]' : 'text-white/25'}`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
