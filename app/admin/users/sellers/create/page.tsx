import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CreateSellerForm } from './CreateSellerForm';
import Link from 'next/link';
import { ArrowLeft, Store } from 'lucide-react';

export default async function CreateSellerPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'ADMIN') redirect('/dashboard');

  return (
    <div style={{ padding: '32px', maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Link
          href="/admin/users/sellers"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(212,175,55,0.15)', color: '#d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Store size={14} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#d4af37', textTransform: 'uppercase' }}>
              SELLER MANAGEMENT
            </span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '4px 0 0 0' }}>
            Create New Seller Account
          </h1>
        </div>
      </div>

      {/* Form Component */}
      <CreateSellerForm />
    </div>
  );
}
