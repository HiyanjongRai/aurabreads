import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { User, Mail, MapPin, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div style={{ color: '#fff', maxWidth: 640 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Profile Settings</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Manage your personal details</p>
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontWeight: 600 }}>Full Name</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 14px' }}>
            <User size={16} color="rgba(255,255,255,0.4)" />
            <input defaultValue={user.name} style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: 14, width: '100%' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontWeight: 600 }}>Email Address</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 14px' }}>
            <Mail size={16} color="rgba(255,255,255,0.4)" />
            <input defaultValue={user.email} disabled style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', outline: 'none', fontSize: 14, width: '100%' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontWeight: 600 }}>Shipping Address</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 14px' }}>
            <MapPin size={16} color="rgba(255,255,255,0.4)" />
            <input defaultValue={user.address} style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: 14, width: '100%' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontWeight: 600 }}>Account Role</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 12, padding: '10px 14px' }}>
            <Shield size={16} color="#d4af37" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#d4af37' }}>{user.role}</span>
          </div>
        </div>

        <button style={{
          marginTop: 8,
          background: 'linear-gradient(135deg, #d4af37, #a07c2e)',
          border: 'none',
          borderRadius: 12,
          padding: '12px 24px',
          color: '#000',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          alignSelf: 'flex-start'
        }}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
