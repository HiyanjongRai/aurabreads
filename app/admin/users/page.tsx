import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Search, Filter, UserPlus, MoreHorizontal, CheckCircle, Clock, XCircle } from 'lucide-react';

const users = [
  { id: '1', name: 'Priya Sharma',   email: 'priya@example.com',  role: 'CUSTOMER', status: 'active',   joined: '12 Jan 2026', orders: 8  },
  { id: '2', name: 'Arun Thapa',    email: 'arun@example.com',   role: 'SELLER',   status: 'active',   joined: '5 Feb 2026',  orders: 0  },
  { id: '3', name: 'Sita Karki',    email: 'sita@example.com',   role: 'CUSTOMER', status: 'active',   joined: '18 Mar 2026', orders: 3  },
  { id: '4', name: 'Bikash Rai',    email: 'bikash@example.com', role: 'CUSTOMER', status: 'inactive', joined: '2 Apr 2026',  orders: 1  },
  { id: '5', name: 'Mina Gurung',   email: 'mina@example.com',   role: 'SELLER',   status: 'pending',  joined: '20 May 2026', orders: 0  },
  { id: '6', name: 'Admin User',    email: 'admin@example.com',  role: 'ADMIN',    status: 'active',   joined: '1 Jan 2026',  orders: 0  },
];

const roleColor: Record<string, string> = {
  ADMIN:    'bg-red-500/15 text-red-400 border border-red-500/20',
  SELLER:   'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/20',
  CUSTOMER: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
};

const statusIcon: Record<string, React.ReactNode> = {
  active:   <CheckCircle size={11} className="text-emerald-400" />,
  inactive: <XCircle size={11} className="text-red-400" />,
  pending:  <Clock size={11} className="text-amber-400" />,
};

const statusLabel: Record<string, string> = {
  active:   'text-emerald-400',
  inactive: 'text-red-400',
  pending:  'text-amber-400',
};

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'ADMIN') redirect('/dashboard');

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Users</h1>
          <p className="text-white/40 text-sm mt-0.5">Manage all customers, sellers, and admins.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #d4af37, #a07c2e)' }}>
          <UserPlus size={16} />
          <span>Invite User</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
          <Search size={15} className="text-white/30" />
          <input placeholder="Search by name or email…" className="bg-transparent text-sm text-white placeholder-white/30 outline-none flex-1" />
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/50 hover:text-white hover:border-white/20 transition">
          <Filter size={15} />
          <span>Filter</span>
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/5 text-white/30 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 hidden sm:table-cell">Status</th>
                <th className="px-6 py-4 hidden md:table-cell">Orders</th>
                <th className="px-6 py-4 hidden lg:table-cell">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-black flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #d4af37, #a07c2e)' }}>
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{u.name}</p>
                        <p className="text-white/30">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${roleColor[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`flex items-center gap-1.5 capitalize font-medium ${statusLabel[u.status]}`}>
                      {statusIcon[u.status]}
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-white/60">{u.orders}</td>
                  <td className="px-6 py-4 hidden lg:table-cell text-white/40">{u.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination stub */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
          <span className="text-xs text-white/30">Showing 6 of 4,871 users</span>
          <div className="flex items-center gap-1">
            {['1','2','3','…','48'].map((p) => (
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
