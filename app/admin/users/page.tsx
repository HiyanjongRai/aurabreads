import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';
import { createClient } from '@supabase/supabase-js';
import AdminUsersClient, { AdminUserRow } from '@/components/admin/AdminUsersClient';

export const dynamic = 'force-dynamic';

function formatDate(date: Date | string) {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(d);
}

async function getAdminUsers(): Promise<{ users: AdminUserRow[]; total: number }> {
  // 1. Try Prisma DB Query
  try {
    const db = getDb();
    const [rawUsers, total] = await Promise.all([
      db.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          isVerified: true,
        },
      }),
      db.user.count(),
    ]);

    const users: AdminUserRow[] = rawUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role as 'ADMIN' | 'SELLER' | 'CUSTOMER',
      createdAt: formatDate(u.createdAt),
      isVerified: u.isVerified,
    }));

    return { users, total };
  } catch (err) {
    console.warn('[getAdminUsers] Prisma error fallback to Supabase REST:', err);
  }

  // 2. Fallback to Supabase REST API
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    if (url && key) {
      const supabase = createClient(url, key, { auth: { persistSession: false } });
      const { data, count } = await supabase
        .from('User')
        .select('id, name, email, role, createdAt, isVerified', { count: 'exact' })
        .order('createdAt', { ascending: false });

      if (data && data.length > 0) {
        const users: AdminUserRow[] = data.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role || 'CUSTOMER',
          createdAt: formatDate(u.createdAt),
          isVerified: !!u.isVerified,
        }));
        return { users, total: count ?? users.length };
      }
    }
  } catch (fallbackErr) {
    console.error('[getAdminUsers] Fallback error:', fallbackErr);
  }

  return { users: [], total: 0 };
}

export default async function AdminUsersPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'ADMIN') redirect('/dashboard');

  const { users, total } = await getAdminUsers();

  return <AdminUsersClient initialUsers={users} totalUsers={total} />;
}
