import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Search, PlusCircle, Filter, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';

const products = [
  { id: '1', name: 'Gold Bead Bracelet',       sku: 'GBB-001', category: 'Bracelets',  price: 'NPR 1,850', stock: 42,  status: 'Active',   seller: 'Luxora Jewels' },
  { id: '2', name: 'Crystal Pendant Necklace', sku: 'CPN-001', category: 'Necklaces',  price: 'NPR 3,200', stock: 18,  status: 'Active',   seller: 'Golden Craft'  },
  { id: '3', name: 'Pearl Drop Earrings',      sku: 'PDE-001', category: 'Earrings',   price: 'NPR 2,200', stock: 5,   status: 'Low Stock', seller: 'Bead World'   },
  { id: '4', name: 'Silver Chain Anklet',      sku: 'SCA-001', category: 'Anklets',    price: 'NPR 1,400', stock: 0,   status: 'Out',      seller: 'Silver Lane'  },
  { id: '5', name: 'Rose Gold Ring Set',       sku: 'RGR-001', category: 'Rings',      price: 'NPR 2,800', stock: 31,  status: 'Active',   seller: 'Luxora Jewels' },
  { id: '6', name: 'Kundan Choker Set',        sku: 'KCS-001', category: 'Necklaces',  price: 'NPR 5,500', stock: 8,   status: 'Active',   seller: 'Golden Craft'  },
];

const statusConfig: Record<string, string> = {
  Active:    'bg-emerald-500/15 text-emerald-400',
  'Low Stock': 'bg-amber-500/15 text-amber-400',
  Out:       'bg-red-500/15 text-red-400',
  Archived:  'bg-white/10 text-white/40',
};

export default async function AdminProductsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'ADMIN') redirect('/dashboard');

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Products</h1>
          <p className="text-white/40 text-sm mt-0.5">All products across every seller.</p>
        </div>
        <Link href="/admin/products/add"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #d4af37, #a07c2e)' }}>
          <PlusCircle size={16} />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Products', value: '342' },
          { label: 'Active',         value: '298' },
          { label: 'Low Stock',      value: '31'  },
          { label: 'Out of Stock',   value: '13'  },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/5 px-4 py-3"
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
          <Search size={15} className="text-white/30" />
          <input placeholder="Search products…" className="bg-transparent text-sm text-white placeholder-white/30 outline-none flex-1" />
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/50 hover:text-white hover:border-white/20 transition">
          <Filter size={15} /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/5 text-white/30 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4 hidden sm:table-cell">SKU</th>
                <th className="px-6 py-4 hidden md:table-cell">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 hidden sm:table-cell">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 hidden lg:table-cell">Seller</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-black flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #d4af37, #a07c2e)' }}>
                        {p.name[0]}
                      </div>
                      <span className="font-semibold text-white truncate max-w-[130px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell font-mono text-white/40">{p.sku}</td>
                  <td className="px-6 py-4 hidden md:table-cell text-white/60">{p.category}</td>
                  <td className="px-6 py-4 font-bold text-white">{p.price}</td>
                  <td className="px-6 py-4 hidden sm:table-cell text-white/60">{p.stock === 0 ? '—' : `${p.stock} units`}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${statusConfig[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-white/40">{p.seller}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg text-white/30 hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition">
                        <Trash2 size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
          <span className="text-xs text-white/30">Showing 6 of 342 products</span>
          <div className="flex items-center gap-1">
            {['1','2','3','…','57'].map((p) => (
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
