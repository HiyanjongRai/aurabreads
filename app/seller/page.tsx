import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  DollarSign, ShoppingBag, Package, Users,
  PlusCircle, TrendingUp, TrendingDown, ArrowUpRight,
  Clock, CheckCircle, AlertTriangle,
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

const statusStyle: Record<string, string> = {
  Active:    'bg-emerald-50 text-emerald-700',
  'Low Stock': 'bg-amber-50 text-amber-700',
  Archived:  'bg-slate-100 text-slate-500',
  delivered: 'bg-emerald-500/15 text-emerald-400',
  pending:   'bg-amber-500/15 text-amber-400',
  shipped:   'bg-blue-500/15 text-blue-400',
};

export default async function SellerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'SELLER' && user.role !== 'ADMIN') redirect('/dashboard');

  const firstName = user.name.split(' ')[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 rounded-3xl p-8 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between"
        style={{ background: 'linear-gradient(135deg, #111111 0%, #1c1508 100%)', border: '1px solid rgba(212,175,55,0.2)' }}>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            Seller Portal
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-white">
            Welcome back, {firstName}!
          </h1>
          <p className="text-xs text-slate-400 max-w-md">
            Manage your store, track inventory, and grow your catalog.
          </p>
        </div>
        <Link
          href="/seller/products/add"
          className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-xs font-bold text-black shadow-lg transition hover:shadow-xl shrink-0"
          style={{ background: 'linear-gradient(135deg, #d4af37, #a07c2e)' }}
        >
          <PlusCircle size={18} />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Revenue',   value: 'NPR 12,450', change: '+14.2%', up: true,  icon: DollarSign },
          { label: 'Total Orders',    value: '384',         change: '+8.1%',  up: true,  icon: ShoppingBag },
          { label: 'Active Products', value: '42',          change: '+4',     up: true,  icon: Package },
          { label: 'Customers',       value: '1,280',       change: '+18.6%', up: true,  icon: Users },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">{item.label}</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9a84c]/10 text-[#a07c2e]">
                <item.icon size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">{item.value}</span>
              <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${item.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {item.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Products Table */}
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <h2 className="font-sans text-base font-semibold text-slate-900">Products</h2>
              <p className="text-xs text-slate-500">Your current catalog</p>
            </div>
            <Link
              href="/seller/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a07c2e] hover:text-[#c9a84c] transition"
            >
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">SKU</th>
                  <th className="px-6 py-3 hidden sm:table-cell">Category</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3 hidden md:table-cell">Stock</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {sampleProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d4af37]/10 text-[#a07c2e] font-bold text-xs flex-shrink-0">
                          {p.name[0]}
                        </div>
                        <span className="font-semibold text-slate-900 truncate max-w-[120px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-400">{p.sku}</td>
                    <td className="px-6 py-4 hidden sm:table-cell">{p.category}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{p.price}</td>
                    <td className="px-6 py-4 hidden md:table-cell">{p.stock} units</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyle[p.status]}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${p.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <h2 className="text-sm font-semibold text-slate-900">Recent Orders</h2>
            <Link href="/seller/orders" className="text-xs font-bold text-[#a07c2e] hover:text-[#c9a84c] flex items-center gap-1 transition">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/80 transition">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                    {o.customer[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{o.customer}</p>
                    <p className="text-[11px] text-slate-400">{o.id} · {o.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-900">{o.amount}</p>
                  <span className={`mt-0.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${statusStyle[o.status]}`}>
                    {o.status === 'delivered' && <CheckCircle size={9} />}
                    {o.status === 'pending'   && <Clock size={9} />}
                    {o.status === 'shipped'   && <AlertTriangle size={9} />}
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
