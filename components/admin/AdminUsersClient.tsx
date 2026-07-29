'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';
import { bulkDeleteUsersAction } from '@/app/actions/admin';
import {
  Search,
  Filter,
  UserPlus,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  Store,
  Users as UsersIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Mail,
  UserCheck,
  Shield,
  Trash2,
} from 'lucide-react';

export type AdminUserRow = {
  id: string;
  name: string | null;
  email: string;
  role: 'ADMIN' | 'SELLER' | 'CUSTOMER';
  createdAt: string;
  isVerified: boolean;
};

type Props = {
  initialUsers: AdminUserRow[];
  totalUsers: number;
};

export default function AdminUsersClient({ initialUsers, totalUsers }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [users, setUsers] = useState<AdminUserRow[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [roleTab, setRoleTab] = useState<'ALL' | 'ADMIN' | 'SELLER' | 'CUSTOMER'>('ALL');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const pageSize = 10;

  // Filtered list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const query = search.toLowerCase().trim();
      const nameMatch = u.name ? u.name.toLowerCase().includes(query) : false;
      const emailMatch = u.email.toLowerCase().includes(query);
      const matchesSearch = !query || nameMatch || emailMatch;

      if (!matchesSearch) return false;
      if (roleTab !== 'ALL' && u.role !== roleTab) return false;

      return true;
    });
  }, [users, search, roleTab]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page, pageSize]);

  const sellerCount = users.filter((u) => u.role === 'SELLER').length;
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const customerCount = users.filter((u) => u.role === 'CUSTOMER').length;
  const visibleIds = paginatedUsers.map((u) => u.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id]));
  };

  const handleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
      return;
    }

    setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;

    startTransition(async () => {
      const result = await bulkDeleteUsersAction(selectedIds);
      setFeedback(result.message || (result.success ? 'Selected users removed.' : 'Could not delete the selected users.'));

      if (result.success) {
        setUsers((prev) => prev.filter((user) => !selectedIds.includes(user.id)));
        setSelectedIds([]);
        setPage(1);
        router.refresh();
      }
    });
  };

  return (
    <div className="dashboard-page-container" style={{ padding: '32px', maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, color: '#ffffff' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 99, border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.08)', padding: '4px 12px', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: '#d4af37', textTransform: 'uppercase' }}>
            <Sparkles size={12} />
            USER MANAGEMENT WORKSPACE
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '8px 0 0' }}>
            All Accounts & Users
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            Manage customers, sellers, and system administrators from one place.
          </p>
        </div>

        <button
          onClick={() => toast.info('Invite User', 'A sign-up invite link would be sent to the user\'s email.')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            borderRadius: 12,
            padding: '10px 20px',
            fontSize: 13,
            fontWeight: 700,
            color: '#000000',
            background: 'linear-gradient(135deg, #d4af37, #a07c2e)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(212,175,55,0.3)',
          }}
        >
          <UserPlus size={16} />
          <span>Invite User</span>
        </button>
      </div>

      {/* ── Toast Demo Toolbar ─────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14,
          padding: '12px 18px',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginRight: 4 }}>
          Notifications Preview
        </span>
        {[
          { label: '✓ Success', fn: () => toast.success('Role Updated', 'User role has been changed to Seller.'), bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', color: '#34d399' },
          { label: '✕ Error', fn: () => toast.error('Permission Denied', 'You do not have authority to perform this action.'), bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', color: '#f87171' },
          { label: '⚠ Warning', fn: () => toast.warning('Confirm Required', 'Deleting a user will remove all their data permanently.'), bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', color: '#fbbf24' },
          { label: 'ℹ Info', fn: () => toast.info('Invite Sent', 'Sign-up link sent to user@example.com.'), bg: 'rgba(212,175,55,0.12)', border: 'rgba(212,175,55,0.3)', color: '#d4af37' },
        ].map((item) => (
          <button
            key={item.label}
            onClick={item.fn}
            style={{
              padding: '7px 16px',
              borderRadius: 10,
              border: `1px solid ${item.border}`,
              background: item.bg,
              color: item.color,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.02em',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {[
          { key: 'ALL', label: 'Total Registered Users', count: totalUsers, color: '#818cf8', icon: UsersIcon },
          { key: 'SELLER', label: 'Verified Sellers', count: sellerCount, color: '#d4af37', icon: Store },
          { key: 'ADMIN', label: 'Administrators', count: adminCount, color: '#4ade80', icon: ShieldCheck },
          { key: 'CUSTOMER', label: 'Customers', count: customerCount, color: '#60a5fa', icon: UserCheck },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = roleTab === item.key;
          return (
            <div
              key={item.key}
              onClick={() => {
                setRoleTab(item.key as any);
                setPage(1);
              }}
              style={{
                background: isSelected ? 'rgba(212,175,55,0.08)' : '#161622',
                border: isSelected ? '1px solid #d4af37' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18,
                padding: '20px 22px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                <span style={{ fontSize: 26, fontWeight: 800, color: item.color, display: 'block', lineHeight: 1 }}>
                  {item.count}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginTop: 6, display: 'block' }}>
                  {item.label}
                </span>
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={20} color={item.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, background: '#161622', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 18 }}>
        
        {/* Role Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 14 }}>
          {[
            { id: 'ALL', label: `All Users (${totalUsers})` },
            { id: 'SELLER', label: `Sellers (${sellerCount})` },
            { id: 'ADMIN', label: `Admins (${adminCount})` },
            { id: 'CUSTOMER', label: `Customers (${customerCount})` },
          ].map((tab) => {
            const isActive = roleTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setRoleTab(tab.id as any);
                  setPage(1);
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, #d4af37, #a07c2e)' : 'rgba(255,255,255,0.04)',
                  color: isActive ? '#000000' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '9px 14px' }}>
            <Search size={16} color="rgba(255,255,255,0.3)" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by user name or email address…"
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#ffffff', fontSize: 13, width: '100%' }}
            />
          </div>
        </div>

      </div>

      {/* Users Table Card */}
      <div style={{ background: '#161622', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', gap: 12, flexWrap: 'wrap' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={handleSelectAllVisible}
              style={{ accentColor: '#d4af37', width: 15, height: 15 }}
            />
            {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Select all on this page'}
          </label>

          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              disabled={isPending}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                borderRadius: 10,
                padding: '8px 12px',
                fontSize: 12,
                fontWeight: 700,
                color: '#ffffff',
                background: 'rgba(239,68,68,0.16)',
                border: '1px solid rgba(239,68,68,0.35)',
                cursor: isPending ? 'wait' : 'pointer',
              }}
            >
              <Trash2 size={14} />
              {isPending ? 'Deleting...' : 'Delete Selected'}
            </button>
          )}
        </div>

        {feedback && (
          <div style={{ padding: '12px 20px 0', color: feedback.includes('Could not') ? '#f87171' : '#34d399', fontSize: 12, fontWeight: 600 }}>
            {feedback}
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={handleSelectAllVisible}
                      style={{ accentColor: '#d4af37', width: 15, height: 15 }}
                    />
                    Select
                  </span>
                </th>
                <th style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  User Profile
                </th>
                <th style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Email Address
                </th>
                <th style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Role Tag
                </th>
                <th style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Account Status
                </th>
                <th style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Joined Date
                </th>
                <th style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => {
                  const initial = (u.name || u.email).charAt(0).toUpperCase();

                  // Role badge styling
                  let roleBg = 'rgba(96,165,250,0.15)';
                  let roleColor = '#60a5fa';
                  let roleBorder = '1px solid rgba(96,165,250,0.3)';

                  if (u.role === 'ADMIN') {
                    roleBg = 'rgba(239,68,68,0.15)';
                    roleColor = '#f87171';
                    roleBorder = '1px solid rgba(239,68,68,0.3)';
                  } else if (u.role === 'SELLER') {
                    roleBg = 'rgba(212,175,55,0.15)';
                    roleColor = '#d4af37';
                    roleBorder = '1px solid rgba(212,175,55,0.3)';
                  }

                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(u.id)}
                          onChange={() => toggleSelection(u.id)}
                          style={{ accentColor: '#d4af37', width: 15, height: 15 }}
                        />
                      </td>

                      {/* Avatar & Name */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: 99,
                              background: u.role === 'ADMIN'
                                ? 'linear-gradient(135deg, #ef4444, #b91c1c)'
                                : u.role === 'SELLER'
                                ? 'linear-gradient(135deg, #d4af37, #a07c2e)'
                                : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 13,
                              fontWeight: 800,
                              color: '#ffffff',
                              flexShrink: 0,
                            }}
                          >
                            {initial}
                          </div>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: 0 }}>
                              {u.name || 'Anonymous User'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                        {u.email}
                      </td>

                      {/* Role Tag */}
                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '4px 10px',
                            borderRadius: 99,
                            fontSize: 11,
                            fontWeight: 800,
                            background: roleBg,
                            color: roleColor,
                            border: roleBorder,
                          }}
                        >
                          {u.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            color: u.isVerified ? '#34d399' : '#f59e0b',
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          <CheckCircle2 size={13} />
                          {u.isVerified ? 'Active & Verified' : 'Registered'}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                        {u.createdAt}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <button
                          onClick={() => alert(`User Details:\nName: ${u.name}\nEmail: ${u.email}\nRole: ${u.role}`)}
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 8,
                            padding: '6px 12px',
                            color: 'rgba(255,255,255,0.7)',
                            cursor: 'pointer',
                            fontSize: 12,
                          }}
                        >
                          View Info
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            Showing {paginatedUsers.length} of {filteredUsers.length} users ({totalUsers} total in DB)
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: page === 1 ? 'rgba(255,255,255,0.2)' : '#ffffff',
                cursor: page === 1 ? 'default' : 'pointer',
              }}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
              <button
                key={pNum}
                onClick={() => setPage(pNum)}
                style={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  border: 'none',
                  background: page === pNum ? 'linear-gradient(135deg, #d4af37, #a07c2e)' : 'rgba(255,255,255,0.04)',
                  color: page === pNum ? '#000000' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                }}
              >
                {pNum}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: page === totalPages ? 'rgba(255,255,255,0.2)' : '#ffffff',
                cursor: page === totalPages ? 'default' : 'pointer',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
